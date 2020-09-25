import { createStackNavigator } from '@react-navigation/stack'
import * as React from 'react'
import { ScrollView, View, FlatList, Alert } from 'react-native'
import { IconButton, Card, Paragraph, List, TextInput, Portal, Dialog, Button, Snackbar, useTheme, Caption, Colors, Avatar } from 'react-native-paper'
// import { Viewport } from '@skele/components'
import { useFocusEffect } from '@react-navigation/native'
import * as SecureStore from 'expo-secure-store'
import Axios from 'axios'
import { SERVER_URI, AXIOS_HEADERS } from '../../config'
import * as WebBrowser from 'expo-web-browser'
import { SourceContext } from '../../Context/SourceContext'

const Received = ({navigation}) => {

    const [cards, setCards] = React.useState([])
    const [loading, setLoading] = React.useState(true)

    
    useFocusEffect(React.useCallback(() => {
        fetchCards()
    }, []))


    const fetchCards = () => {
        SecureStore.getItemAsync('token')
        .then(token => 
            Axios.get(
                `${SERVER_URI}/rnd/review/`,
                {
                    headers: {
                        ...AXIOS_HEADERS,
                        "Authorization": `Bearer ${token}`
                    }
                }
            )    
        )
        .then(res => {
            setCards(res.data)
            setLoading(false)
        })
        .catch(err => {
            Alert(err.message)
            setLoading(false)
        })
    }

    const changeFlag = (id, flag, visited) => {
        setLoading(true)
        SecureStore.getItemAsync('token')
        .then(token => Axios.post(
            `${SERVER_URI}/rnd/review/`,
            {
                id, flag, visited
            },
            {
                headers: {
                    ...AXIOS_HEADERS,
                    "Authorization": `Bearer ${token}`
                }
            }
        ))
        .then(res => {fetchCards()})
        .catch(err => {
            alert(err.message)
            setLoading(false)
        })
    }

    return (
        <>
            <FlatList
                data={cards}
                keyExtractor={(item, index) => index.toString()}
                extraData={cards}
                renderItem={({index, item}) => 
                    <Card 
                        key={index} 
                        style={{marginTop: 20}}
                    >
                        <Card.Title
                            title={item.first_name + item.last_name}
                            subtitleNumberOfLines={3}
                            subtitle={
                                <Caption 
                                    onPress={() => 
                                        WebBrowser.openBrowserAsync("http://" + item.url)
                                        .then(console.log)
                                        .catch(console.log)
                                    }
                                    style={{color: Colors.blue500}}
                                >
                                    {item.url}
                                </Caption>
                            }
                            left = {props => <Avatar.Text {...props} 
                                label={item.first_name.slice(0,1) + item.last_name.slice(0,1)}/>
                            }
                            right = {props =>
                                <IconButton
                                    icon={
                                        item.sentiment === 1.0 ? 'emoticon-happy' :
                                        item.sentiment === 0 ? 'emoticon-neutral' :
                                        'emoticon-sad'
                                    } 
                                    color={
                                        item.sentiment === 1.0 ? Colors.green500 :
                                        item.sentiment === 0 ? Colors.orange500 :
                                        Colors.red500
                                    }
                                />
                            }
                        />
                        <List.Accordion title="Content" id="1">
                            <Card.Content>
                                <Card>
                                <Card.Title
                                    title={item.profile_name}
                                    left = {props => <Avatar.Text {...props} label={
                                            item.profile_name.split(" ").map((val, index) => {
                                                if (index < 2)
                                                    return val.slice(0,1)
                                            }).join('')
                                        }/>
                                    }
                                />
                                <Card.Content>
                                    <Paragraph>
                                        {item.text}
                                    </Paragraph>
                                </Card.Content>
                                </Card>
                            </Card.Content>
                        </List.Accordion>
                        <List.Item
                            title="Mark as read"
                            left={<IconButton icon='eye'/>}
                            onPress={() => changeFlag(item.id, 1, true)}
                        />
                    </Card>
                }
            />
            <Snackbar visible={loading} onDismiss={() => {}}>
                Fetching received posts
            </Snackbar>
        </>
    )
}

const Stack = createStackNavigator()

export default ({navigation}) => {
    
    const {src} = React.useContext(SourceContext)

    return (
    <Stack.Navigator>
        <Stack.Screen
            name="Received Posts"
            component={Received}
            options={{
                headerLeft: () => <IconButton icon='menu' onPress={() => navigation.toggleDrawer()}/>,
                headerRight: () => <IconButton icon={src}/>
            }}
        />
    </Stack.Navigator>
)}