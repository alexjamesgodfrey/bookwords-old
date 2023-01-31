import { useEffect, useState } from 'react'
import { GoogleBookItem } from 'types/GoogleBooks'
import { Database } from 'types/supabase'
import { Button } from 'ui'
import supabase from 'utils/supabase'
import BigStat from './BigStat'
import SmallStat from './SmallStat'

interface Props {
  contribution: Database['public']['Tables']['contributions']['Row']
  book: GoogleBookItem
}

export default function Contribution({ contribution, book }: Props) {
  // const supabase = useSupabaseClient<Database>()

  const [withGrammarTops, setWithGrammarTops] = useState<
    Database['public']['Tables']['tops_on_contribution']['Row'][]
  >([])

  const [withoutGrammarTops, setWithoutGrammarTops] = useState<
    Database['public']['Tables']['tops_on_contribution']['Row'][]
  >([])

  useEffect(() => {
    const fetchTops = async () => {
      const { data: tops, error: topsError } = await supabase
        .from('tops_on_contribution')
        .select('*')
        .eq('contribution_id', contribution.id)
        .eq('is_common', true)

      setWithGrammarTops(tops)

      const { data: tops2, error: topsError2 } = await supabase
        .from('tops_on_contribution')
        .select('*')
        .eq('contribution_id', contribution.id)
        .eq('is_common', false)

      setWithoutGrammarTops(tops2)
    }

    fetchTops()
  }, [contribution.id])

  return (
    <div>
      <div className="flex w-full items-center justify-center">
        <BigStat
          num={contribution.average_word.toPrecision(3)}
          label="avg. word length"
        />
        <BigStat num={contribution.words.toLocaleString()} label="words" />
        <BigStat
          num={withoutGrammarTops[0]?.word || ''}
          label="top non-grammar word"
        />
      </div>

      <div className="wrap flex items-center justify-center gap-2 ">
        <Button variant="info" arrow="diagonal">
          A Song of Ice and Fire
        </Button>
        {book.volumeInfo.authors?.length > 0 && (
          <Button variant="info" arrow="diagonal">
            {book.volumeInfo.authors[0]}
          </Button>
        )}
        <Button variant="info" arrow="diagonal">
          Alex Godfrey
        </Button>
        <Button variant="info" arrow="diagonal">
          Use API
        </Button>
      </div>

      <div>
        <h3 className="m-0 mt-2 p-0">Raw Data</h3>
        <div className="wrap flex items-center justify-center">
          <SmallStat num={contribution.words.toLocaleString()} label="words" />
          <SmallStat
            num={contribution.characters_including_spaces.toLocaleString()}
            label="characters"
          />
          <SmallStat
            num={contribution.characters_excluding_spaces.toLocaleString()}
            label="non-space characters"
          />
          <SmallStat
            num={contribution.sentences.toLocaleString()}
            label="sentences"
          />
          <SmallStat
            num={contribution.paragraphs.toLocaleString()}
            label="paragraphs"
          />
        </div>
      </div>

      <div>
        <h3 className="mb-0 pb-0">Length Analysis</h3>
        <div className="flex items-center justify-center">
          <SmallStat
            num={contribution.average_word.toPrecision(3)}
            label="avg. word length"
          />
          <SmallStat
            num={contribution.average_sentence.toPrecision(3)}
            label="avg. sentence length"
          />
          <SmallStat
            num={contribution.average_paragraph.toPrecision(3)}
            label="avg. paragraph length"
          />
        </div>
      </div>

      <h3>Top Words</h3>
      <h3>Top Non-Grammar Words</h3>
      <h3>Top Names</h3>
      <h3>Sentiment Analysis</h3>
    </div>
  )
}
