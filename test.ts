import { TextQueryIterator } from './src/text-query-iterator';
import { fromGoogle } from './src/search-google';


async function askAgent(question: string)
{
  let searchQuery: TextQueryIterator | null = null;

  searchQuery = new TextQueryIterator(fromGoogle, 0.2, 1024, question);
  await searchQuery.init();
 
  const result: string[] = [];
  const continueSearch = true;

  while (continueSearch) {
    const searchResponse = searchQuery.next();
    if (searchResponse.done || result.length > 3) {
      break;
    }
    result.push(searchResponse.value);
  }

  console.log(result);
}

askAgent('current tennis world champion').then((answer) => {
  console.log('\nANSWER', answer);
});

