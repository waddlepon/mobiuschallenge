import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Bom from '../components/bom'
import Grid from '@material-ui/core/Grid';
import { getBoms, getBomItems, BomItem } from '../lib/bomapi';
import { GetServerSideProps } from 'next';

export default function Home({
  boms_list
}: { boms_list: {
      id: string
      bom_items: BomItem[] 
   }[]
}) {
  return (
    <div className={styles.container}>
      <Head>
        <title>BOM Frontend</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Grid container spacing={1}>
          {boms_list.map(({ id, bom_items }) => (
            <Grid item key={id}>
              <Bom id={id} bom_items={bom_items} />
            </Grid>
          ))}
        </Grid>
      </main>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    let boms_list = await Promise.all((await getBoms()).map(async bom => {
      let items = await getBomItems(bom.id);
      return { id: bom.id, bom_items: items };
    }));
    return { 
      props: {
        boms_list
      }
    }
  } catch (error) {
    //for now 404 if api gives no answer
    console.log(error);
    return {
      notFound: true
    }
  }

}
