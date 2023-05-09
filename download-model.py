from huggingface_hub import hf_hub_download

#
# Use this file if you have python3 and use hubstuff cache for models
# Take output from this code and add path to the model to .env file
#

downloaded_model_path = hf_hub_download(
    repo_id="eachadea/ggml-vicuna-13b-1.1",
    filename="ggml-vic13b-q5_1.bin"
)

print(downloaded_model_path)

