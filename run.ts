import { usePromptTool } from "./src/core/prompt-toolbox";

usePromptTool('SEARCH', 'What is most recent Russian movie about space?').then((answer) => {
  console.log('\nANSWER', answer);
});

