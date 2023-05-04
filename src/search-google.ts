import { TextResourceSearchFunction, TextResourceSearchResult } from './interfaces/text-resource.interface';
import { convert } from 'html-to-text';

import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const GOOGLE_SEARCH_API_KEY: string | undefined = process.env.GOOGLE_SEARCH_API_KEY;
const GOOGLE_SEARCH_CX: string | undefined = process.env.GOOGLE_SEARCH_CX;

const parseSite = async (url: string): Promise<TextResourceSearchResult> => {
  try {
    const response = await axios.get(url);

    const html = response?.data;
    if (!html) {
      console.log('EMPTY_HTML: ', url);
      return { resource: url, text: '' };
    }

    const content = convert(html).replace(/\[.+?\]/g, ' ').trim();

    // console.log('\n\n****** CONTENT: ', content);

    // const doc = new JSDOM(removeScriptsAndStyles(html), { url });
    // const reader = new Readability(doc.window.document);
    // const article = reader.parse();
    // const content = article?.textContent?.replace(/\s+/g, ' ').trim();

    return { resource: url, text: content ?? '' };

  } catch (e) {
    console.error('SITE_PARSE_ERROR:', url);
    return { resource: url, text: '' };
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function googleSearch(query: string): Promise<any[]> {
  try {
    const url = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_SEARCH_API_KEY}&cx=${GOOGLE_SEARCH_CX}&q=${query}`;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const response = await axios.get(url).catch((error) => console.error('AXIOS ERROR:', url));
    if (!response?.data?.items) {
      console.error('GOOGLE_SEARCH_ERROR:', url);
      return [];
    }
    return response.data.items;
  } catch (e) {
    console.error('GOOGLE_SEARCH_ERROR:', e);
    return [];
  }
}
/*
  {
    kind: 'customsearch#result',
    title: 'Apple',
    htmlTitle: '<b>Apple</b>',
    link: 'https://www.apple.com/',
    displayLink: 'www.apple.com',
    snippet: 'Discover the innovative world of Apple and shop everything iPhone, iPad, Apple Watch, Mac, and Apple TV, plus explore accessories, entertainment',
    htmlSnippet: 'Discover the innovative world of <b>Apple</b> and shop everything iPhone, iPad, <b>Apple</b> Watch, Mac, and <b>Apple</b> TV, plus explore accessories, entertainment,&nbsp;...',
    cacheId: 'xEELJvdODswJ',
    formattedUrl: 'https://www.apple.com/',
    htmlFormattedUrl: 'https://www.<b>apple</b>.com/',
    pagemap: { cse_thumbnail: [Array], metatags: [Array], cse_image: [Array] }
  },
*/

export const fromGoogle: TextResourceSearchFunction = async (query, maxResources = 10) => {
  try {
    const urls = (await googleSearch(query)).slice(0, maxResources);

    const fetchSites = urls.map((googleResult) => {
      console.log('Parsing site:', googleResult.link);
      return parseSite(googleResult.link);
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const fetchResults = await Promise.all(fetchSites).catch((error) =>
      console.log(`Some sites failed while fetching/parsing.`)
    );

    if (!fetchResults) {
      return [];
    }

    return fetchResults.filter((result) => result && result.text.length > 0);

  } catch (e) {
    console.log('INTERNET_SEARCH_ERROR:');
    return [];
  }
}



