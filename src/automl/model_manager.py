"""
AutoML model management for agricultural predictions.
"""
import os
from google.cloud import aiplatform
from google.cloud import storage
from typing import Tuple, Dict, Any
import logging

class AgriAutoMLManager:
    def __init__(
        self,
        project_id: str,
        region: str = "us-central1",
        bucket_name: str = None
    ):
        self.project_id = project_id
        self.region = region
        self.bucket_name = bucket_name
        self.api_endpoint = f"{region}-aiplatform.googleapis.com"
        
        # Initialize Vertex AI
        aiplatform.init(
            project=project_id,
            location=region,
            api_endpoint=self.api_endpoint
        )
        
        self.vision_model = None
        self.tabular_model = None
    
    def create_datasets(
        self,
        vision_data_path: str,
        tabular_data_path: str
    ) -> Tuple[aiplatform.ImageDataset, aiplatform.TabularDataset]:
        """Create AutoML datasets for vision and tabular data."""
        # Create vision dataset
        vision_dataset = aiplatform.ImageDataset.create(
            display_name="cropnet_satellite_images",
            gcs_source=vision_data_path,
            import_schema_uri=aiplatform.schema.dataset.ioformat.image.regression
        )
        
        # Create tabular dataset
        tabular_dataset = aiplatform.TabularDataset.create(
            display_name="cropnet_weather_crop_data",
            gcs_source=tabular_data_path,
            import_schema_uri=aiplatform.schema.dataset.ioformat.tabular.regression
        )
        
        return vision_dataset, tabular_dataset
    
    def train_models(
        self,
        vision_dataset: aiplatform.ImageDataset,
        tabular_dataset: aiplatform.TabularDataset,
        budget_hours: float = 0.25  # Minimum training time (15 minutes) for quick testing
    ):
        """Train AutoML vision and tabular models."""
        # Train vision model
        vision_job = aiplatform.AutoMLImageTrainingJob(
            display_name="cropnet_vision_model",
            prediction_type="regression"
        )
        self.vision_model = vision_job.run(
            dataset=vision_dataset,
            target_column="yield",
            budget_milli_node_hours=budget_hours * 1000,  # 250 milli-node hours = 15 minutes
            model_display_name="cropnet_vision_model_dev",
            training_fraction_split=0.6,  # Use 60% for faster training
            validation_fraction_split=0.2,  # 20% for validation
            test_fraction_split=0.2,  # 20% for testing
            disable_early_stopping=True  # Disable early stopping for quick runs
        )
        
        # Train tabular model
        tabular_job = aiplatform.AutoMLTabularTrainingJob(
            display_name="cropnet_tabular_model",
            optimization_prediction_type="regression"
        )
        self.tabular_model = tabular_job.run(
            dataset=tabular_dataset,
            target_column="yield",
            optimization_objective="minimize-rmse",
            budget_milli_node_hours=budget_hours * 1000,
            model_display_name="cropnet_tabular_model_dev",
            training_fraction_split=0.6,
            validation_fraction_split=0.2,
            test_fraction_split=0.2,
            disable_early_stopping=True,  # Disable early stopping for quick runs
            optimization_hours=0.25  # 15 minutes optimization time
        )
    
    def load_existing_models(
        self,
        vision_model_id: str,
        tabular_model_id: str
    ):
        """Load existing models by their IDs."""
        self.vision_model = aiplatform.Model(vision_model_id)
        self.tabular_model = aiplatform.Model(tabular_model_id)
    
    def predict(
        self,
        satellite_image_path: str,
        weather_crop_data: Dict[str, Any],
        vision_weight: float = 0.5
    ) -> Dict[str, Any]:
        """
        Make predictions using both models.
        
        Args:
            satellite_image_path: Path to satellite image in GCS
            weather_crop_data: Dictionary of weather and crop features
            vision_weight: Weight for vision model prediction (0 to 1)
            
        Returns:
            Dictionary containing predictions and confidence scores
        """
        if not self.vision_model or not self.tabular_model:
            raise ValueError("Models not loaded. Call train_models or load_existing_models first.")
        
        # Get predictions from both models
        vision_prediction = self.vision_model.predict([satellite_image_path])
        tabular_prediction = self.tabular_model.predict([weather_crop_data])
        
        # Combine predictions
        tabular_weight = 1.0 - vision_weight
        final_prediction = (
            vision_weight * vision_prediction[0] +
            tabular_weight * tabular_prediction[0]
        )
        
        return {
            "yield_prediction": float(final_prediction),
            "vision_prediction": float(vision_prediction[0]),
            "tabular_prediction": float(tabular_prediction[0]),
            "confidence_score": min(
                vision_prediction.confidence[0],
                tabular_prediction.confidence[0]
            )
        }
