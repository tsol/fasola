import { TextQueryIterator } from '../text-query-iterator';
import { fromGoogle } from '../search-google';

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

  return result;
}

askAgent('current price of bitcoin').then((answer) => {
  console.log('\nANSWER', answer);
});

