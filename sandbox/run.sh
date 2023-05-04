#!/bin/sh

#PROMPT=test
#PROMPT=good/json-booba-00
#PROMPT=validation-js-detailed
#PROMPT=fix-js-00
#PROMPT=validation-apples
#PROMPT=validation-coffee-00
#PROMPT=search-example
#PROMPT=answer-find-files
PROMPT=space-movie

#MODEL=../models/ggml-vic13b-q4_1.bin
#MODEL=../models/ggml-vic13b-q5_1.bin
#MODEL=../models/ggml-vic13b-uncensored-q8_0.bin
#MODEL=../models/wizardLM-7B.ggml.q5_1.bin
MODEL=../models/stable-vicuna-13B.ggml.q5_1.bin

PROMPT_FILE=../sandbox/prompts/${PROMPT}.txt
cd ../llama.cpp

./main --temp 0.8 -c 2048 -m $MODEL -f ${PROMPT_FILE}

#./main -m $MODEL -f ${PROMPT_FILE}

#./main --mirostat 2 --mirostat_lr 0.1 --mirostat_ent 5.0 --temp 0.8 -m $MODEL -f ${PROMPT_FILE}

#./main --top_k 1 --top_p 1 --temp 0 -m $MODEL -f ${PROMPT_FILE}

#./main --seed 1682878598 -m $MODEL -f ${PROMPT_FILE}

#./main -c 1024 --temp 0.1 -m $MODEL -f ${PROMPT_FILE}

#./main --no-mmap --batch_size 512 --temp 0.1 -c 512 -m $MODEL -f ${PROMPT_FILE}

#./main --verbose-prompt --batch_size 2048 --temp 0.1 -c 4096 -m $MODEL -f ${PROMPT_FILE}

#./main --temp 0.1 -c 2048 --repeat_penalty 1.2 -m $MODEL -f ${PROMPT_FILE}

#./main -i --interactive-first -r "### Human:" --temp 0.2 -c 2048 -n -1 --ignore-eos --repeat_penalty 1.2 --instruct -m $MODEL -f ${PROMPT_FILE}

#./main --interactive-first --temp 0.7 -c 1024 --repeat_penalty 1.2 -m $MODEL
#./main -i --temp 0.2 -c 1024 --repeat_penalty 1.2 --instruct -m $MODEL -f ${PROMPT_FILE}

#./main -m ./models/ggml-vicuna-13b-4bit.bin -n 256 --repeat_penalty 1.1 --color -i -r "### Human:" -f ${PROMPT_FILE}

#./main -m ../models/ggml-vic13b-q5_1.bin -p "Building a website can be done in 10 simple"

