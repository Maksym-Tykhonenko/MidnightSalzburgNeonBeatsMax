const ONBOARD_KEY_BEAT = 'twoLands_onboard';
import {
    ImageBackground as BeatBg,
    View as BeatBox,
    Dimensions as BeatDims,
    Image as BeatImg,
    Platform,
    Animated, // Додаємо Animated
    Easing,   // Додаємо Easing для плавності
} from 'react-native';
import React, {
    useLayoutEffect as useBeatLayoutEff,
    useRef, // Додаємо useRef
    useEffect, // Додаємо useEffect
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation as useBeatNav } from '@react-navigation/native';


const MidnightSalzburgNeonBeatsLoading: React.FC = () => {
    const { width: beatWidth, height: beatHeight } = BeatDims.get('window');
    const navigation = useBeatNav();

    // Додаємо animated value
    const scaleAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Безкінечна пульсація
        Animated.loop(
            Animated.sequence([
                Animated.timing(scaleAnim, {
                    toValue: 1.15,
                    duration: 900,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 900,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [scaleAnim]);

    useBeatLayoutEff(() => {
        let goOnboarding = false;
        let goRegister = false;

        const init = async () => {
            try {
                const [flagOnboard, user] = await Promise.all([
                    AsyncStorage.getItem(ONBOARD_KEY_BEAT),
                    AsyncStorage.getItem('twoLandsUser'),
                ]);

                if (!flagOnboard && !user) {
                    goOnboarding = true;
                    await AsyncStorage.setItem(ONBOARD_KEY_BEAT, 'true');
                } else if (flagOnboard && !user) {
                    goRegister = true;
                }
            } catch (err) {
                if (__DEV__) console.warn('MidnightSalzburgNeonBeatsLoading error:', err);
            }

            //setTimeout(() => {
            //    // navigation.repace(
            //    navigation.replace(
            //        goOnboarding
            //            ? 'MidnightSalzburgNeonBeatsOnboarding'
            //            : 'MidnightSalzburgNeonBeatsPagesConnection'
            //    );
            //}, 3119);
        };

        init();
    }, [navigation]);

    return (
        <BeatBox style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <BeatBg
                source={require('../MidnightSalzburgNeonBeatsAssets/MidnightSalzburgNeonBeatsImages/midnightAppGround.png')}
                style={{
                    alignSelf: 'center',
                    position: 'absolute',
                    width: beatWidth,
                    height: beatHeight,
                    zIndex: -1,
                }}
                resizeMode="cover"
            />

            <Animated.View
                style={{
                    transform: [{ scale: scaleAnim }],
                }}
            >
                <BeatImg
                    source={Platform.OS !== 'android'
                        ? require('../MidnightSalzburgNeonBeatsAssets/MidnightSalzburgNeonBeatsImages/midnightSalLogo.png')
                        : require('../MidnightSalzburgNeonBeatsAssets/MidnightSalzburgNeonBeatsImages/888LogoIco.png')}
                    style={{
                        height: beatWidth * 0.5906546,
                        width: beatWidth * 0.5906546,
                    }}
                    resizeMode="contain"
                />
            </Animated.View>
        </BeatBox>
    );
};

export default MidnightSalzburgNeonBeatsLoading;