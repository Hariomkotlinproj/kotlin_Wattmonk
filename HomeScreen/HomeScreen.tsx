import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Dimensions,
  Text,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Pressable,
  TouchableWithoutFeedback,
  Modal,
  RefreshControl,
  ActivityIndicator,
  Image,
  PermissionsAndroid,
  Platform,
  Animated,
  Easing,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import NotificationIcon from 'react-native-vector-icons/Ionicons';
import HomeScreenStyle from './homeScreenStyle';
import LocationIcon from '../../../assets/svgicon/location.svg';
import Miles from '../../../assets/svgicon/Miles.svg';
import FilterIcon from '../../../assets/svgicon/filterIcon.svg';
import RefershIcon from '../../../assets/svgicon/refershIcon.svg';
import Callicon from '../../../assets/svgicon/Callicon.svg';
import { AppTextInput } from '@components/customcomponent';
import { SelectCountry } from 'react-native-element-dropdown';
import Color from '@utils/color';
import Icon from 'react-native-vector-icons/AntDesign';
import Buildingicon from 'react-native-vector-icons/MaterialCommunityIcons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { Calendar } from 'react-native-calendars';
import { useTheme } from '../../customcomponent/theme/ThemeContext';
import { darkTheme, lightTheme } from '@components/customcomponent/theme/styles';
import Screen from '@utils/screen';
import Images from '@utils/Images';
import Loader from '@utils/loader/Loader';
import { getSurveyorListing, getSurveyorListingCount } from 'src/apis/api';
import SnackbarUtils from '@utils/snackbarUtils';

import Geolocation from '@react-native-community/geolocation';
import { getFromAsyncStorage } from '@utils/asyncStorage';
import { useDispatch, useSelector } from 'react-redux';
import { setLatData, setLongData } from '@redux/reducers/auth';
import { RootState } from '@redux/store';

interface HomeScreenProps {
  navigation?: any;
  text?: any;
  initialParams?: any;
  route?: any;
}
const ITEMS_PER_PAGE = 10;
let globalUserData = null;
let tabtitle = '';
let selecteDay = 'past';
let selectdatevariable = '';
let isLoadMoreCalled = false;
// let userdatawithId = 0;

const HomeScreen = (props: HomeScreenProps) => {
  const navigation = useNavigation();

  // const {navigation, route} = props;
  const styles = HomeScreenStyle(); // Call the ThemeStyles component to get the styles
  const theme = useTheme();
  const [index, setIndex] = useState(0);
  const currentTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const [currentLongitude, setCurrentLongitude] = useState('');
  const [currentLatitude, setCurrentLatitude] = useState('');
  const [locationStatus, setLocationStatus] = useState('');
  const [status, setStatus] = useState('surveyors'); // Change status as needed

  const [userdatawithId, setuserdatawithId] = useState<any | null>(null);

  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setselectedDate] = useState('');
  const [selectedDays, setselectedDays] = useState('today');
  const [skeletonLoader, setskeletonLoader] = useState(true);
  const [skeletonLoaderArr, setskeletonLoaderArr] = useState([
    1, 2, 3, 4, 5, 6, 7, 8, 9,
  ]);
  const [roleId, setRoleId] = useState(0);
  const [assignedCount, setAssignedCount] = useState();
  const [completedCount, setCompletedCount] = useState();
  // Define the routes based on the status
  const [routes, setRoutes] = useState(
    status === 'surveyors'
      ? [
        {
          key: 'first',
          title: 'Assigned',
          count: 0,
          color: Color.themecolor,
        },
        {
          key: 'second',
          title: 'Completed',
          count: 0,
          color: 'rgba(230, 230, 230, 1)',
        },
      ]
      : [
        {
          key: 'first',
          title: 'Surveys',
          count: '(10)',
          color: Color.themecolor,
        },
        {
          key: 'second',
          title: 'Scheduled',
          count: '(05)',
          color: 'rgba(230, 230, 230, 1)',
        },
        {
          key: 'third',
          title: 'Completed',
          count: '(15)',
          color: 'rgba(230, 230, 230, 1)',
        },
      ],
  );
  const tabWidth = (Dimensions.get('window').width * 0.9) / routes.length;
  const [tabListtitle, settablisttitle] = useState('assigned');
  const [surveysListData, setsurveysListData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [Distance, setDistance] = useState('');
  const userData = useRef<any | null>(null);
  // const dispatch = useDispatch();
  // const getcurrentloactionlat = useSelector(
  //   (state: RootState) => state.auth.getcurrentloactionlat,
  // );
  // const getcurrentloactionlong = useSelector(
  //   (state: RootState) => state.auth.getcurrentloactionlong,
  // );
  // console.log('useSelector', getcurrentloactionlat, getcurrentloactionlong);

  const selectdays = [
    {
      value: 'past',
      label: 'Past',
    },
    {
      value: 'today',
      label: 'Today',
    },
    {
      value: 'future',
      label: 'Future',
    },
  ];

  useEffect(() => {
    if (!currentLongitude) {
      requestLocationPermission();
    }
    console.log('userdat.Dat...????..///', userdatawithId);

    if (userdatawithId) {
      getSurveyorList(userdatawithId, 1);
    } else {
      getuserData();
    }
    console.log('first.....', currentLatitude, currentLongitude);

    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity.current, {
          toValue: 1,
          useNativeDriver: true,
          duration: 500,
        }),
        Animated.timing(opacity.current, {
          toValue: 0.3,
          useNativeDriver: true,
          duration: 800,
        }),
      ]),
    );
    animation.start();

    return () => {
      animation.stop();
    };
  }, [tabListtitle, userdatawithId]);

  const opacity = useRef(new Animated.Value(0.3)); // Corrected typo

  // get user data from storage
  const getuserData = async () => {
    let getUserData = await getFromAsyncStorage('user');
    globalUserData = JSON.parse(getUserData);
    console.log('???>roleid??>..', globalUserData?.role?.id);
    setRoleId(globalUserData?.role?.id);
    if (globalUserData?.id) {
      setuserdatawithId(globalUserData?.id);
      console.log('globalUserData?.id..', userdatawithId);
      getSurveyorList(globalUserData?.id, 1);
      getSurveyorListCount(globalUserData?.id);
    }
  };

  const tabRenderItem = ({ item, index }) => {
    let count = null;

    if (item.title === 'Assigned') {
      count = assignedCount; // assignedCount should be set based on your logic
    } else if (item.title === 'Completed') {
      count = completedCount; // completedCount should be set based on your logic
    }

    return (
      <Pressable
        onPress={() => {
          setskeletonLoader(true);
          handleTabPress(index);
          settablisttitle(item.title);
        }}
        style={[
          styles.tabItem,
          { backgroundColor: item.color, width: tabWidth },
        ]}>
        <Text
          style={[
            styles.tabText,
            { color: item.color === Color.themecolor ? 'white' : 'black' },
          ]}>
          {item.title}
        </Text>
        <Text
          style={[
            styles.tabText,
            {
              color: item.color === Color.themecolor ? 'white' : 'black',
              marginLeft: 4,
            },
          ]}>
          ({count})
        </Text>
      </Pressable>
    );
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    console.log('????... handleRefresh');
    // Reset page number to 1 and set hasMore to true
    setPage(1);
    setHasMore(true);
    getSurveyorList(userdatawithId, 1);
    try {
      await getSurveyorList(userdatawithId, 1); // Call getSurveyorList with the updated page number
    } catch (error) {
      // Handle error if necessary
    } finally {
      // After loading is complete (success or failure), set refreshing state to false
      setRefreshing(false);
    }
  };
  console.log('userdatawithId????..', userdatawithId);

  // const loadMore = () => {
  //   console.log('loadMore,.../', userdatawithId);
  //   setHasMore(true);
  //   if (!loading && hasMore) {
  //     // Increment page number before calling getSurveyorList
  //     const nextPage = page + 1;
  //     setPage(nextPage);
  //     // Call getSurveyorList with userdatawithId and nextPage
  //     getSurveyorList(userdatawithId, nextPage);
  //     console.log('inside loadMore,../??//', userdatawithId);
  //     isLoadMoreCalled = true;
  //   }
  // };

  const loadMore = () => {
    console.log('inside loadMore,../??//', userdatawithId);
    isLoadMoreCalled = true;
    getSurveyorList(userdatawithId, 1);
  };

  const renderFooter = () => {
    // If loading is true, render the ActivityIndicator
    if (loading) {
      {
        console.log('first....////');
      }
      return <ActivityIndicator size="small" color={Color.themecolor} />;
    } else {
      // Otherwise, return null to not render anything
      return null;
    }
  };

  const handleDaysChange = async item => {
    console.log('Selected value:>>', item.value);
    setselectedDate('');
    selectdatevariable = '';
    try {
      setselectedDays(item.value);
      setskeletonLoader(true);
      selecteDay = await item.value;
      await getSurveyorList(userdatawithId, 1);
    } catch (error) {
      console.error('Error in handleDayPress:', error);
    }
  };

  const handleSelectButtonPress = () => {
    setShowCalendar(true);
    setselectedDays('');
  };

  const handleCalendarClose = () => {
    setShowCalendar(false);
    console.log('userdatawithId.??.');
    // getSurveyorList(userdatawithId, 1);
  };

  const handleDayPress = async day => {
    try {
      setselectedDate(day.dateString);
      setskeletonLoader(true);
      selectdatevariable = day.dateString;
      await getSurveyorList(userdatawithId, 1);
      // console.log("        setselectedDate///>>...")
    } catch (error) {
      console.error('Error in handleDayPress:', error);
    }
  };

  const handleTabPress = index => {
    const updatedRoutes = routes.map((route, i) => ({
      ...route,
      color: i === index ? Color.themecolor : 'rgba(230, 230, 230, 1)',
    }));
    setIndex(index);
    setRoutes(updatedRoutes);
  };

  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      getContinuousLocation();
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Access Required',
            message: 'This App needs to Access your location',
            buttonPositive: '',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getContinuousLocation();
        } else {
          setLocationStatus('Permission Denied');
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const getContinuousLocation = async () => {
    setLocationStatus('Getting Location ...');
    await Geolocation.watchPosition(
      position => {
        setLocationStatus('You are Here');
        const currentLongitude = JSON.stringify(position.coords.longitude);
        const currentLatitude = JSON.stringify(position.coords.latitude);
        // dispatch(setLatData(currentLatitude));
        // dispatch(setLongData(currentLongitude));
        setCurrentLongitude(currentLongitude);
        setCurrentLatitude(currentLatitude);
        console.log('?>>>>>>./...', userdatawithId);
        if (currentLongitude && currentLatitude) {
          getSurveyorList(userdatawithId, 1);
        }
      },
      error => {
        setLocationStatus(error.message);
      },
      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 1000,
      },
    );
  };

  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(10);
  const [fetchingData, setFetchingData] = useState(false);
  const getSurveyorList = async (userId, pageNumber) => {
    console.log('?>>>?//..', isLoadMoreCalled);
    // setskeletonLoader(true);
    if (isLoadMoreCalled) {
      setLoading(true);
      console.log('true..,.setLoading');
    } else {
      console.log('true...setskeletonLoader');
      setskeletonLoader(true);
    }
    // if (fetchingData) return;
    // setFetchingData(true);
    // setLoading(true);

    try {
      const params = {
        status: tabListtitle,
        bookslotdate: selectdatevariable ? selectdatevariable : selecteDay,
        latitude: currentLatitude,
        longitude: currentLongitude,
        limit: 10,
        skip: skip,
        timezone: currentTimeZone,
        userIdforlist: userId,
      };

      console.log('params...//', params);
      await getSurveyorListing
        .getSurveyorListingData(params)
        .then(response => {
          const newList = response.data.data;

          var data = [];
          if (pageNumber === 1) {
            data = newList;
          } else {
            const filteredNewList = newList.filter(
              newItem =>
                !surveysListData.some(prevItem => prevItem.id === newItem.id),
            );
            data = [...surveysListData, ...filteredNewList];
          }
          console.log('surveysListData.,..//', surveysListData.length);
          // surveysListData.push(data);
          setRefresh(!refresh);
          setsurveysListData(data);
          // setsurveysListData(prevData => [
          //   ...prevData,
          //   ...response?.data?.data,
          // ]);
          // setSkip(prevSkip => prevSkip + 10);
          // setLoading(false);
          // setFetchingData(false);
          // setsurveysListData(prevData => {
          //   // if (surveysListData.length > 0) {
          //   if (pageNumber === 1) {
          //     return newList;
          //   } else {
          //     // Filter out duplicates by comparing unique identifiers (e.g., IDs)
          //     const filteredNewList = newList.filter(
          //       newItem =>
          //         !prevData.some(prevItem => prevItem.id === newItem.id),
          //     );
          //     return [...prevData, ...filteredNewList];
          //   }
          // });
          // setLoading(false);
          // setskeletonLoader(false);
          // if (newList.length === 0 || newList.length % ITEMS_PER_PAGE !== 0) {
          //   setHasMore(false);
          // }
          setLoading(false);
          setskeletonLoader(false);
        })
        .catch(error => {
          Loader.isLoading(false);

          SnackbarUtils.showDangerToast(
            error?.response?.data?.error?.message || error.message,
          );
        });
    } catch (error) {
      Loader.isLoading(false);
      SnackbarUtils.showDangerToast(
        error?.response?.data?.error?.message || error.message,
      );
    }
  };

  const getSurveyorListCount = async userId => {
    // Loader.isLoading(true);
    // setskeletonLoader(true);
    try {
      const params = {
        bookslotdate: selectdatevariable ? selectdatevariable : selecteDay,
        timezone: currentTimeZone,
        userIdforlist: userId,
      };

      // console.log('params...//', params);
      await getSurveyorListingCount
        .getSurveyorListingCountData(params)
        .then((response: any) => {
          console.log('AssignedBBB??...typeof', response?.data);
          setAssignedCount(response?.data?.data?.attributes?.assigned);
          setCompletedCount(response?.data?.data?.attributes?.completed);

          // const newList = response;
          // setskeletonLoader(false);
        })
        .catch(error => {
          Loader.isLoading(false);
          SnackbarUtils.showDangerToast(
            error?.response?.data?.error?.message || error.message,
          );
        });
    } catch (error) {
      Loader.isLoading(false);
      SnackbarUtils.showDangerToast(
        error?.response?.data?.error?.message || error.message,
      );
    }
  };

  const CenteredModal = ({ visible, onClose, onDayPress, markedDates }) => {
    const handleDayPress = day => {
      onDayPress(day);
      onClose(); // Close the modal after selecting a date
    };

    return (
      <Modal
        transparent
        animationType="fade"
        visible={visible}
        onRequestClose={onClose}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View
            style={{
              backgroundColor: 'white',
              padding: 20,
              borderRadius: 10,
              width: '80%',
              alignItems: 'center',
              borderWidth: 1,
            }}>
            <TouchableOpacity
              onPress={onClose}
              style={{ position: 'absolute', top: 10, right: 10 }}>
              <Icon name="close" size={24} color="black" />
            </TouchableOpacity>
            <Calendar onDayPress={handleDayPress} markedDates={markedDates} />
          </View>
        </View>
      </Modal>
    );
  };

  const formatTimeInDisplayFormat = (datestring: any) => {
    if (datestring != null) {
      var d = new Date(datestring);
      var offset = d.getTimezoneOffset();
      d.setMinutes(d.getMinutes() + offset);
      var formatted = new Intl.DateTimeFormat('en', {
        hour: 'numeric',
        minute: 'numeric',
      }).format(d);
      return formatted;
    } else {
      return '-';
    }
  };

  const surveysRenderItem = ({ item }) => {
    // Parse the input date string
    const date = new Date(item?.attributes?.datetime);

    // Format the date to "22 Nov 2024" format
    const formattedDateString = date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    return (
      <View style={styles.SurveysrenderItemStyle}>
        <View style={styles.SurveysListItemview}>
          <View style={styles.callview}>
            <Text numberOfLines={1} style={styles.title}>
              {item?.attributes?.name.charAt(0).toUpperCase() +
                item?.attributes?.name.slice(1)}
            </Text>
            <View style={styles.timeview}>
              <View style={styles.timetextview}>
                <Text style={styles.description}>
                  {formatTimeInDisplayFormat(item?.attributes?.datetime)}
                </Text>
              </View>
              <View style={styles.mobileiconview}>
                <Callicon color={'#595959'} size={10} />
              </View>
            </View>
          </View>
          <View style={styles.locationview}>
            <LocationIcon color={'#595959'} size={10} />
            <View style={styles.left}>
              <Text numberOfLines={1} style={styles.description1}>
                {item?.attributes?.address}
              </Text>
            </View>
          </View>
          <View style={styles.locationview}>
            <Text>
              <Buildingicon
                name="office-building-marker-outline"
                color={'#595959'}
                size={10}
              />
            </Text>
            <View style={styles.left}>
              <Text numberOfLines={1} style={styles.description1}>
                {item?.attributes?.company}
              </Text>
            </View>
          </View>
          <View style={styles.locationview}>
            <Miles color={'#595959'} size={10} />
            <View style={styles.left}>
              <Text style={styles.description}>
                {item?.attributes?.distance} Miles Away
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              // backgroundColor: 'red',
              justifyContent: 'space-between',
            }}>
            <View style={styles.locationview}>
              <Text>
                <Icon name="calendar" color={'#595959'} size={10} />
              </Text>
              <View style={styles.left}>
                <Text style={styles.description}>
                  {formattedDateString} {/* Display the formatted date */}
                </Text>
              </View>
            </View>
            <View style={styles.dollerview}>
              <Text style={styles.dollertext}>$75 - $90</Text>
            </View>
          </View>

          <View style={styles.jobtypview}>
            <View style={styles.locationview}>
              <View style={styles.battryview}>
                <Text style={styles.description}>
                  {item?.attributes?.jobtype.toUpperCase()}
                </Text>
              </View>
            </View>

            <View style={[styles.locationview, styles.left]}>
              <View style={[styles.battryview, styles.statusview]}>
                <View
                  style={[
                    styles.dot,
                    {
                      backgroundColor:
                        item?.attributes?.status === 'assigned'
                          ? '#61B05A'
                          : item?.attributes?.status === 'inreview'
                            ? '#CDCDCD'
                            : item?.attributes?.status === 'reviewfailed'
                              ? '#E25B30'
                              : '#61B05A',
                    },
                  ]}
                />
                <Text style={[styles.description, styles.left]}>
                  {item?.attributes?.status.charAt(0).toUpperCase() +
                    item?.attributes?.status.slice(1)}
                </Text>
              </View>
            </View>
          </View>
        </View>
        {status === 'surveyors' ? (
          <View style={styles.surveysBothButton}>
            <TouchableWithoutFeedback onPress={() => { }}>
              <View style={styles.dropview}>
                <Text style={styles.droptxt}>Drop Survey</Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => { }}>
              <View style={styles.onTheWayView}>
                <Text style={styles.droptxt}>On The Way</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        ) : null}
      </View>
    );
  };

  const SurveysRoute = () => (
    <View
      style={{
        flex: 1,
        // paddingVertical: 10,
        alignSelf: 'center',
      }}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={surveysListData}
        extraData={refresh}
        renderItem={surveysRenderItem}
        keyExtractor={(item, index) => index.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
      />
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.headercenterview}>
          <View style={styles.homeheadar}>
            <View>
              <TouchableOpacity
                onPress={() => {
                  navigation.openDrawer();
                }}>
                <View>
                  <Image
                    source={Images.drawerIcon}
                    style={styles.drawerIcon}
                    resizeMode={'contain'}
                  />
                </View>
              </TouchableOpacity>
            </View>
            <View
              style={{
                width: '80%',
                alignSelf: 'center',
                justifyContent: 'center',
              }}>
              <AppTextInput
                placeHolder="search"
                inputContainer={{ width: '100%' }}
              />
            </View>
            <View
              style={{
                justifyContent: 'flex-start',
                alignItems: 'flex-end',
                paddingVertical: 6,
              }}>
              <TouchableOpacity
                style={{ justifyContent: 'center', alignItems: 'center' }}
                onPress={() => { }}>
                <Text style={{}}>
                  {' '}
                  <NotificationIcon
                    name="notifications-outline"
                    size={29}
                    color={
                      theme === 'dark'
                        ? darkTheme.textColor
                        : lightTheme.textColor
                    }
                  />
                </Text>
              </TouchableOpacity>
              <View
                style={{
                  position: 'absolute',
                  backgroundColor: Color.themecolor,
                  width: 18,
                  height: 18,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 20,
                }}>
                <Text style={{ color: Color.white, fontSize: 11 }}>3</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.Surveysallview}>
          <View style={styles.Surveysallview1}>
            <View style={{}}>
              <Text style={styles.Surveystextview}>Survey</Text>
            </View>
            <View
              style={{
                width: '61%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-evenly',
                // backgroundColor: 'red',
              }}>
              <TouchableWithoutFeedback onPress={() => { }}>
                <View style={styles.calenderbox}>
                  <Text>
                    <FilterIcon />
                  </Text>
                </View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback
                // style={{ marginLeft: 5 }}
                onPress={handleSelectButtonPress}>
                <View style={[styles.calenderbox, { marginLeft: 15 }]}>
                  <Text>
                    <Icon name="calendar" size={20} color="#000" />
                  </Text>
                </View>
              </TouchableWithoutFeedback>
              <View>
                <SelectCountry
                  style={styles.dropdown}
                  selectedTextStyle={styles.selectedTextStyle}
                  placeholderStyle={styles.placeholderStyle}
                  maxHeight={200}
                  value={selectedDays}
                  data={selectdays}
                  valueField="value"
                  labelField="label"
                  placeholder={selectedDate}
                  searchPlaceholder="Search..."
                  onChange={handleDaysChange}
                  imageField={''}
                />
              </View>
              {roleId === 9 ? (
                <TouchableWithoutFeedback
                  onPress={() => getSurveyorList(userdatawithId, 1)}>
                  <View style={styles.calenderbox}>
                    <RefershIcon />
                  </View>
                </TouchableWithoutFeedback>
              ) : (
                <TouchableWithoutFeedback
                  style={styles.pluseicon}
                  onPress={() => navigation.navigate(Screen.ScheduleSurvey)}>
                  <View style={styles.pluseicon}>
                    <Text>
                      <FeatherIcon name="plus" size={20} color={Color.white} />
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              )}
            </View>
            <CenteredModal
              visible={showCalendar}
              onClose={handleCalendarClose}
              onDayPress={handleDayPress}
              markedDates={{ [selectedDate]: { selected: true, marked: true } }}
            />
          </View>
        </View>
        <View
          style={{
            alignItems: 'center',
            paddingVertical: 10,
            // backgroundColor: 'red',
            // width: '95%',
            justifyContent: 'center',
            // alignSelf: 'center'
          }}>
          <FlatList
            horizontal
            data={routes}
            renderItem={tabRenderItem}
            keyExtractor={item => item.key}
            contentContainerStyle={styles.tabBar}
            showsHorizontalScrollIndicator={false}
          />
        </View>
        {skeletonLoader && (
          <View
            style={{
              height: '100%',
              width: '100%',
              // paddingVertical: 10,
              alignSelf: 'center',
              // backgroundColor: 'red'
            }}>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={skeletonLoaderArr}
              renderItem={() => {
                return (
                  <View
                    style={{
                      marginVertical: 5,
                      backgroundColor: '#fff',
                      borderRadius: 7,
                      // padding: 6,
                      width: '100%',
                    }}>
                    <View
                      style={{
                        marginVertical: 5,
                        // backgroundColor: 'red',
                        // borderRadius: 7,
                        padding: 6,
                        // width: '100%',
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          width: '100%',
                          justifyContent: 'space-between',
                          // backgroundColor: 'blue',
                          alignSelf: 'center',
                          paddingVertical: 1,
                        }}>
                        <View>
                          <Animated.View
                            style={[
                              {
                                borderRadius: 4,
                                height: 20,
                                width: 150,
                                backgroundColor: 'rgb(211, 211, 211)',
                              },
                              { opacity: opacity.current },
                            ]}
                          />
                        </View>
                        <View
                          style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <Animated.View
                            style={[
                              {
                                height: 25,
                                width: 50,
                                borderRadius: 4,
                                backgroundColor: 'rgb(211, 211, 211)',
                              },
                              { opacity: opacity.current },
                            ]}
                          />
                          <Animated.View
                            style={[
                              {
                                height: 25,
                                width: 30,
                                backgroundColor: 'rgb(211, 211, 211)',
                                marginLeft: 10,
                                borderRadius: 4,
                              },
                              { opacity: opacity.current },
                            ]}
                          />
                        </View>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginTop: 5,
                        }}>
                        <Animated.View
                          style={[
                            {
                              height: 25,
                              width: 30,
                              backgroundColor: 'rgb(211, 211, 211)',
                              borderRadius: 4,
                            },
                            { opacity: opacity.current },
                          ]}
                        />

                        <Animated.View
                          style={[
                            {
                              marginLeft: 10,
                              height: 20,
                              width: 150,
                              borderRadius: 4,
                              backgroundColor: 'rgb(211, 211, 211)',
                            },
                            { opacity: opacity.current },
                          ]}
                        />
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginTop: 5,
                        }}>
                        <Animated.View
                          style={[
                            {
                              height: 25,
                              width: 30,
                              backgroundColor: 'rgb(211, 211, 211)',
                              borderRadius: 4,
                            },
                            { opacity: opacity.current },
                          ]}
                        />

                        <Animated.View
                          style={[
                            {
                              marginLeft: 10,
                              height: 20,
                              width: 150,
                              borderRadius: 4,
                              backgroundColor: 'rgb(211, 211, 211)',
                            },
                            { opacity: opacity.current },
                          ]}
                        />
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginTop: 5,
                        }}>
                        <Animated.View
                          style={[
                            {
                              height: 25,
                              width: 30,
                              backgroundColor: 'rgb(211, 211, 211)',
                              borderRadius: 4,
                            },
                            { opacity: opacity.current },
                          ]}
                        />

                        <Animated.View
                          style={[
                            {
                              marginLeft: 10,
                              height: 20,
                              width: 150,
                              borderRadius: 4,
                              backgroundColor: 'rgb(211, 211, 211)',
                            },
                            { opacity: opacity.current },
                          ]}
                        />
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginTop: 5,
                        }}>
                        <Animated.View
                          style={[
                            {
                              height: 25,
                              width: 30,
                              backgroundColor: 'rgb(211, 211, 211)',
                              borderRadius: 4,
                            },
                            { opacity: opacity.current },
                          ]}
                        />

                        <Animated.View
                          style={[
                            {
                              marginLeft: 10,
                              height: 20,
                              width: 150,
                              borderRadius: 4,
                              backgroundColor: 'rgb(211, 211, 211)',
                            },
                            { opacity: opacity.current },
                          ]}
                        />
                      </View>

                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginTop: 5,
                        }}>
                        <Animated.View
                          style={[
                            {
                              height: 25,
                              width: 60,
                              borderRadius: 4,
                              backgroundColor: 'rgb(211, 211, 211)',
                            },
                            { opacity: opacity.current },
                          ]}
                        />
                        <Animated.View
                          style={[
                            {
                              height: 25,
                              width: 60,
                              borderRadius: 4,
                              backgroundColor: 'rgb(211, 211, 211)',
                              marginLeft: 10,
                            },
                            { opacity: opacity.current },
                          ]}
                        />
                      </View>
                    </View>
                    <View
                      style={{
                        justifyContent: 'flex-end',
                        alignItems: 'flex-end',
                        flexDirection: 'row',
                        // backgroundColor: 'red'
                      }}>
                      <Animated.View
                        style={[
                          {
                            height: 35,
                            width: 90,
                            borderTopLeftRadius: 5,
                            backgroundColor: 'rgb(211, 211, 211)',
                          },
                          { opacity: opacity.current },
                        ]}
                      />
                      <Animated.View
                        style={[
                          {
                            marginLeft: 4,
                            height: 35,
                            width: 90,
                            borderBottomEndRadius: 7,
                            backgroundColor: 'rgb(211, 211, 211)',
                          },
                          { opacity: opacity.current },
                        ]}
                      />
                    </View>
                  </View>
                );
              }}
              keyExtractor={item => item.id}
            />
          </View>
        )}
        <View style={styles.scene}>
          {!skeletonLoader && surveysListData.length > 0 ? (
            routes[index].title === routes[index].title && <SurveysRoute />
          ) : (
            <View>
              <Text>No Surveys Found</Text>
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Image
                  style={{ width: 80, height: 90 }}
                  source={Images.Nodatalogo}
                />
              </View>
            </View>
          )}
        </View>
        {/* {!skeletonLoader && && surveysListData.length > 0? (
          <View>
            <Text>No Surveys Found</Text>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Image
                style={{ width: 80, height: 90 }}
                source={Images.Nodatalogo}
              />
            </View>
          </View>
          :
          null
        )} */}
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
