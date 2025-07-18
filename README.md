# AgriAutoML Project

Agricultural crop yield prediction using Vertex AI AutoML and PaLM API.

## Prerequisites

1. Google Cloud Platform (GCP) Account
2. Vertex AI API enabled
3. Service account with necessary permissions:
   - Vertex AI User
   - Storage Object Viewer
   - BigQuery Data Viewer (if using BigQuery)

## Environment Setup

1. **Create a new Vertex AI Workbench instance:**
   ```bash
   gcloud notebooks instances create agri-automl \
     --vm-image-project=deeplearning-platform-release \
     --vm-image-family=pytorch-latest-gpu \
     --machine-type=n1-standard-4 \
     --location=us-central1-a
   ```

2. **Clone the repository:**
   ```bash
   git clone https://github.com/punithavalli-ayyasamy/Hackathon2025.git
   cd Hackathon2025
   ```

3. **Set up Python environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements-vertex.txt
   ```

4. **Configure environment variables:**
   - Copy `.env.template` to `.env`
   - Update with your configuration:
     ```env
     GCP_PROJECT_ID=your-project-id
     GCP_REGION=your-region
     GOOGLE_APPLICATION_CREDENTIALS=path/to/your/service-account-key.json
     ```

## End-to-End Execution Flow

Follow these steps in order to run the complete prediction pipeline:

1. **Model Training (`1_model_training.ipynb`):**
   - Sets up Vertex AI initialization
   - Creates and trains both vision and tabular models
   - Key components:
     - Vision model for satellite image analysis
     - Tabular model for weather and crop data
   - Requirements:
     - GCS bucket with training data
     - Properly formatted datasets

2. **Prompt Handler Setup (`2_prompt_handler.ipynb`):**
   - Configures the text-bison-32k model
   - Sets up natural language query processing
   - Tests information extraction from queries
   - Validates JSON output format

3. **Prediction API (`3_prediction_api.ipynb`):**
   - Initializes FastAPI server
   - Implements the `/predict` endpoint
   - Combines:
     - Natural language processing
     - Model predictions
     - Response formatting

## Project Structure

```
AgriAutoML/
├── notebooks/              # Vertex AI Workbench notebooks
│   ├── config.yaml        # Notebook configuration
│   ├── 1_model_training.ipynb
│   ├── 2_prompt_handler.ipynb
│   └── 3_prediction_api.ipynb
├── src/                   # Source code (for local development)
├── requirements.txt       # Local development requirements
├── requirements-vertex.txt # Vertex AI requirements
└── .env                  # Environment variables
```

## Features

- AutoML Vision model for satellite image analysis
- AutoML Tabular model for weather and crop data
- Natural language interface using PaLM API (text-bison-32k model)
- FastAPI server for predictions
- Vertex AI Workbench integration

## Testing the API

1. **Start the FastAPI server:**
   - Run the complete `3_prediction_api.ipynb` notebook
   - Server will start on `http://localhost:8000`

2. **Make prediction requests:**
   ```bash
   curl -X POST "http://localhost:8000/predict" \
        -H "Content-Type: application/json" \
        -d '{"query": "What is the expected yield for my 5 hectare corn field in Iowa that I planted on April 15th?"}'
   ```

3. **Expected response format:**
   ```json
   {
     "query": "What is the expected yield...",
     "structured_data": {
       "location": "Iowa",
       "crop_type": "corn",
       "planting_date": "2025-04-15",
       "field_size": 5
     },
     "predictions": {
       "estimated_yield": "X tons/hectare"
     }
   }
   ```

## Troubleshooting

1. **Authentication Issues:**
   - Verify service account key path in `.env`
   - Ensure service account has required permissions
   - Check GCP project and region settings

2. **Model Training Errors:**
   - Validate dataset format and accessibility
   - Check GCS bucket permissions
   - Verify sufficient quota for Vertex AI training

3. **API Connection Issues:**
   - Confirm FastAPI server is running
   - Check port availability (default: 8000)
   - Verify network connectivity in Workbench instance
