import styled               from "styled-components";

import Layout               from "@/components/layout";
import CollectionHeading    from "@/components/collection-heading";
import Card                 from "@/components/card";
import ProductCard          from '@/components/product-card';
import CardCollection       from '@/components/card-collection';
import Image                from '@/components/image';

import ImageVersion         from 'core/image-version';

import Banner               from '@/public/banner.jpg';

export async function getStaticProps(context) {
    const knexClient        = require('core/api/knex');
    const nameDB            = knexClient.connect('../name-db/names.db');
    let randomNames = [];
    // const nameCount = await nameDB('name').count();
    const nameCount = 27306287;

    while(randomNames.length < 12) {
        const randomID = 1 + Math.floor(Math.random() * nameCount);
        const randomName = (await nameDB('name').select().where({id: randomID}))[0].name;
        if(randomName.match(/^[A-Za-z]+$/g) && !randomNames.includes(randomName)) {
            randomNames.push(randomName);
        }
    }

    const description = `Are you looking for name shirt? We have various designs of name printed on T shirt, Hoodie, Sweatshirt, Mug... Check it now and pick your favorites!`;
    return {
        props: {
            description,
            randomNames
        },
        revalidate: 300, // In seconds
    }
}

const Container = styled.div`
    .card {
    }

    .product {
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: bold;
        font-size: 2rem;
        color: transparent;
        transition: .2s;
    }

    .mobile-banner {
        display: none;
    }

    @media screen and (max-width: 800px) {
        .desktop-banner {
            display: none;
        }

        .mobile-banner {
            display: block;
        }
    }
`;

export default function HomePage(props) {
    const {description, randomNames} = props;
    const names = randomNames.map(name => {
        return name.trim().replaceAll(' ', '-')
    }).filter(name => !!name);

    return <Layout title="Home" description={description}>
        <Container>
            <Card style={{ width: '100%' }} ratio={2} className="desktop-banner">
                <Image src={Banner} alt="banner" placeholder="blur" blurDataURL="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" layout="fill" objectFit="cover" priority={true}/>
            </Card>
            <Card style={{ width: '100%' }} ratio={1} className="mobile-banner">
                <Image src={Banner} alt="banner" placeholder="blur" blurDataURL="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" layout="fill" objectFit="cover" priority={true}/>
            </Card>
            <CollectionHeading>
                Editor&apos;s pick
            </CollectionHeading>
            <CardCollection gap="1rem">
                { names.map((name, idx) =>
                    <ProductCard key={idx} 
                        imageURL={`https://cdn.printinix.com/mockup-image/my-blood-type-is-custom-name-t-shirt---${encodeURIComponent(name.replaceAll('_', ' ').replaceAll('-', ' '))}.jpg?v=${ImageVersion()}&scale=0.4`}
                        href={"/"+name}
                        title={name.replaceAll('_', ' ').replaceAll('-', ' ')}
                        hoverTitle="View products"
                    />
                ) }
            </CardCollection>
        </Container>
    </Layout>;
}