from huggingface_hub import hf_hub_download

#	удалено:       ggml-vic13b-q4_0.bin
#	удалено:       ggml-vic13b-q4_1.bin
#	удалено:       ggml-vic13b-q4_2.bin
#	удалено:       ggml-vic13b-q4_3.bin
#	удалено:       ggml-vic13b-q5_0.bin
#	удалено:       ggml-vic13b-q5_1.bin
#	удалено:       ggml-vic13b-uncensored-q4_2.bin
#	удалено:       ggml-vic13b-uncensored-q4_3.bin
#	удалено:       ggml-vic13b-uncensored-q5_1.bin
#	удалено:       ggml-vic13b-uncensored-q8_0.bin

#downloaded_model_path = hf_hub_download(
#    repo_id="eachadea/ggml-vicuna-13b-1.1",
#    filename="ggml-vic13b-q4_1.bin"
#)


downloaded_model_path = hf_hub_download(
    repo_id="TheBloke/wizardLM-7B-GGML",
    filename="wizardLM-7B.ggml.q5_1.bin"
)

print(downloaded_model_path)

