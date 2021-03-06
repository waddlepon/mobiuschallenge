import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Bom from '../components/bom'
import { getBoms, getBomItems, BomItem } from '../lib/bomapi';
import { GetServerSideProps } from 'next';

export default function Home({
  boms_list
}: { boms_list: {
      id: string
      bom_items: BomItem[] 
   }[]
}) {
  console.log(boms_list[0].bom_items);
  return (
    <div className={styles.container}>
      <Head>
        <title>BOM Frontend</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <ul>
          {boms_list.map(({ id, bom_items }) => (
            <li key={id}>
              <Bom id={id} bom_items={bom_items} />
            </li>
          ))}
        </ul>
      </main>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  let boms_list = await Promise.all((await getBoms()).map(async bom => {
    let items = await getBomItems(bom.id);
    return { id: bom.id, bom_items: items };
  }));
  return { 
    props: {
      boms_list
    }
  }
}
