/**
 * Return string of form "'word' | 'word2' | 'word3'" for each word in query. Used
 * in Postgres full text search queries.
 * @param query query string
 */
export default function makeQueryString(query: string) {
  const words = query.split(' ')
  return words.map((word) => `'${word}'`).join(' | ')
}
