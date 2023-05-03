import {spawn} from 'child_process';

const LLAMA_CPP = './llama.cpp/main';
const NEXT_TOKEN_TIMEOUT_MS = 600_000;

export type ActionResult =  Record<string, string> | null;
export type StopActionParser = (string) => ActionResult;

export class LLMProcess {
    private llm: ReturnType<typeof spawn> | null = null;
    private params: string;
    private executablePath: string;
    private modelPath: string;
    
    constructor(model : string, params: string) {
        this.params = params;
        this.executablePath = LLAMA_CPP;
        this.modelPath = `./models/${model}.bin`; 
    }

    public open(): void {
        if (this.llm !== null) {
            this.close();
        }

        const spawnArgs = this.params.split(' ');
        spawnArgs.push('-m', this.modelPath);
        spawnArgs.unshift(this.executablePath);
        
        console.log('OPEN_LLM_PROCESS: ', spawnArgs.join(' '));

        this.llm = spawn(spawnArgs[0], spawnArgs.slice(1), {stdio: ['pipe', 'pipe', 'ignore']});
       
    }

    public close(): void {
        if (this.llm !== null) {
            this.llm.kill();
            this.llm = null;
        }
    }

    public prompt(prompt: string, stopActionParser: StopActionParser): Promise<ActionResult> {

        if (this.llm === null || this.llm.stdin === null) {
            throw new Error("llm is not initialized.");
        }
        
        this.llm.stdin.write(prompt + "\n");
    
        return new Promise((resolve, reject) => {
            let response = "";
            let timeoutId: NodeJS.Timeout;
    
            const onStdoutData = (data: Buffer) => {
                const text = data.toString();
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }
                
                process.stdout.write(text);

                response += text;
                const stopAction = stopActionParser(response);

                if (stopAction) {
                    stopListening();
                    this.llm?.kill('SIGINT'); // Ctrl+C
                    resolve(stopAction);
                } else {
                    timeoutId = setTimeout(() => {
                        console.log('Timeout reached - Resolving...');
                        stopListening();
                        resolve({
                            action: 'TIMEOUT'
                        });
                    }, NEXT_TOKEN_TIMEOUT_MS);
                }
                
 
            };
    
            const onStdoutError = (err: Error) => {
                this.llm?.stdout?.removeListener("data", onStdoutData);
                this.llm?.stdout?.removeListener("error", onStdoutError);
                reject(err);
            };
    
            const stopListening = () => {
                this.llm?.stdout?.removeListener("data", onStdoutData);
                this.llm?.stdout?.removeListener("error", onStdoutError);
            }
    
            this.llm?.stdout?.on("data", onStdoutData);
            this.llm?.stdout?.on("error", onStdoutError);
        });
    }
}