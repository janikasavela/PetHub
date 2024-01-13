import React, { useEffect, useState } from 'react';
import { FlatList , StyleSheet, Text } from 'react-native';

import Screen from '../components/Screen';
import Card from '../components/Card';
import colors from '../config/colors';
import routes from '../navigation/routes';
import listingsApi from '../api/listings'
import AppText from '../components/AppText';
import AppButton from '../components/AppButton';
import {firestore, collection, query, onSnapshot, doc, USERS, getDoc, getDocs, orderBy} from '../firebase/Config'
import { QuerySnapshot } from 'firebase/firestore';


const listings = [
    {
        id: 1,
        title: 'Chicken Treats for sale',
        price: 15,
        image: require('../assets/food.webp')
    },
    {
        id: 2,
        title: 'Dog collar for sale',
        price: 35,
        image: require('../assets/collar.webp')
    }
]

function ListingScreen({ navigation }) {

const [listings, setListings] = useState([])
const [error, setError] = useState(false)
const [loaded, setLoaded] = useState(false)

useEffect(()=>{
      const q = query(collection(firestore, "ilmoitukset"))
      const unsubscribe = onSnapshot(q,(querySnapshot)=>{
          const data = []

          querySnapshot.forEach((doc)=>{
              data.push({
                  id: doc.id,
                  title: doc.data().title,
                  price: doc.data().price,
                  image: require('../assets/collar.webp')
              })
          })
             setListings(data)
             setLoaded(true)
             console.log("LOADED ", data)
          })
          return () =>{
              unsubscribe()
          }
      }, [])

/* const loadListings = async () => {
  const response = await listingsApi.getListings()
  if(!response.ok) return setError(true)
  setError(false)
  setListings(response.data)
} */

   if(!loaded) return <Screen><Text>Loading..</Text></Screen>

    return (
    <Screen style={styles.screen}>
     {/*  {error && <>
      <AppText>Couldn't retrieve the listings.</AppText>
      <AppButton title="Retry" onPress={loadListings}/>
      </>} */}
       <FlatList
       data={listings}
       keyExtractor={listing => listing.id.toString()}
       renderItem={({item}) => 
    <Card
      title={item.title}
      subTitle={"$" + item.price}
      image={item.image} 
      onPress={() => navigation.navigate(routes.LISTING_DETAILS, item)}/>
    }
       />
       </Screen>
    );
}

const styles = StyleSheet.create({
    screen: {
      padding: 20,
      backgroundColor: colors.light,
    },
  });

export default ListingScreen;