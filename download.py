from huggingface_hub import hf_hub_download

#downloaded_model_path = hf_hub_download(
#    repo_id="eachadea/ggml-vicuna-13b-1.1",
#    filename="ggml-vic13b-q5_1.bin"
#)


#downloaded_model_path = hf_hub_download(
#    repo_id="TheBloke/wizardLM-7B-GGML",
#    filename="wizardLM-7B.ggml.q5_1.bin"
#)


#downloaded_model_path = hf_hub_download(
#    repo_id="TheBloke/stable-vicuna-13B-GGML",
#    filename="stable-vicuna-13B.ggml.q5_1.bin"
#)

downloaded_model_path = hf_hub_download(
    repo_id="TheBloke/wizard-vicuna-13B-GGML",
    filename="wizard-vicuna-13B.ggml.q5_1.bin"
)

print(downloaded_model_path)

