import MidnightSalzburgNeonStories from './MidnightSalzburgNeonStories';
import MidnightSalzburgNeonMap from './MidnightSalzburgNeonMap';
import MidnightSalzburgNeonSettings from './MidnightSalzburgNeonSettings';
import MidnightSalzburgNeonBeats from './MidnightSalzburgNeonBeats';
import
React, {
    useEffect as usePulseNavEffect,
    useState as usePulseNavState,
}
    from 'react';
import {
    Image as PulseNavImg,
    View as PulseNavBox,
    Dimensions as PulseNavDims,
    Platform as PulseNavPlatform,
    TouchableOpacity as PulseNavPress,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// --- Типи екранів ---
type MidnightPulseScreens =
    | 'Midnight Salzburg Neon Beats Pages Connection'
    | 'Midnight Salzburg Neon Beats Map'
    | 'Midnight Salzburg Neon Beats Stories'
    | 'Midnight Salzburg Neon Beats Settings';



// --- Головний компонент ---
const MidnightSalzburgNeonBeatsPagesConnection: React.FC = () => {
    const [pulseDims, setPulseDims] = usePulseNavState(PulseNavDims.get('window'));
    const [pulseScreen, setPulseScreen] = usePulseNavState<MidnightPulseScreens>('Midnight Salzburg Neon Beats Pages Connection');
    const [pulseMode, setPulseMode] = usePulseNavState<'letters' | 'numbers'>('letters');

    const navButtons: {screen: MidnightPulseScreens; icon: any }[] = [
        { screen: 'Midnight Salzburg Neon Beats Pages Connection', icon: require('../MidnightSalzburgNeonBeatsAssets/MidnightSalzburgNeonBeatsImages/midnightWord.png') },
        { screen: 'Midnight Salzburg Neon Beats Map', icon: require('../MidnightSalzburgNeonBeatsAssets/MidnightSalzburgNeonBeatsImages/midnightMap.png') },
        { screen: 'Midnight Salzburg Neon Beats Stories', icon: require('../MidnightSalzburgNeonBeatsAssets/MidnightSalzburgNeonBeatsImages/midnightStories.png') },
        { screen: 'Midnight Salzburg Neon Beats Settings', icon: require('../MidnightSalzburgNeonBeatsAssets/MidnightSalzburgNeonBeatsImages/midnightSettings.png') },
    ];

    // Ініціалізація AsyncStorage
    usePulseNavEffect(() => {
        const initMusicSetting = async () => {
            let value = await AsyncStorage.getItem('musicEnabled');
            if (value === null) {
                await AsyncStorage.setItem('musicEnabled', 'true');
                value = 'true';
            }
        };
        initMusicSetting();
    }, []);

    // Рендер екранів
    const renderPulseScreens = () => {
        switch (pulseScreen) {
            case 'Midnight Salzburg Neon Beats Pages Connection':
                return <MidnightSalzburgNeonBeats setPulseScreen={setPulseScreen} setPulseMode={setPulseMode} />;
            case 'Midnight Salzburg Neon Beats Map':
                return <MidnightSalzburgNeonMap />;
            case 'Midnight Salzburg Neon Beats Stories':
                return <MidnightSalzburgNeonStories />;
            case 'Midnight Salzburg Neon Beats Settings':
                return <MidnightSalzburgNeonSettings />;
            default:
                return null;
        }
    };

    return (
        <PulseNavBox
            style={{
                width: pulseDims.width,
                height: pulseDims.height,
                flex: 1,
                backgroundColor: '#00124C',
            }}
        >
            <PulseNavImg
                source={require('../MidnightSalzburgNeonBeatsAssets/MidnightSalzburgNeonBeatsImages/midnightAppGround.png')}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: pulseDims.width,
                    height: pulseDims.height,
                    zIndex: 0,
                }}
            />

            {PulseNavPlatform.OS === 'android' && (
                <PulseNavBox style={{ paddingTop: pulseDims.height * 0.0310345 }} />
            )}

            {renderPulseScreens()}

            {/* Кнопки меню */}
            <PulseNavBox
                style={{
                    bottom: pulseDims.height * 0.031,
                    position: 'absolute',
                    alignSelf: 'center',
                    alignItems: 'center',
                    width: pulseDims.width * 0.8046456,
                    height: pulseDims.height * 0.0880543,
                    borderRadius: pulseDims.width * 0.04,
                    paddingHorizontal: pulseDims.width * 0.016,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                }}
            >
                {navButtons.map((btn, index) => (
                    <PulseNavPress
                        key={index}
                        onPress={() => setPulseScreen(btn.screen)}
                        style={{
                            width: pulseDims.width * 0.16,
                            height: pulseDims.width * 0.16,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: pulseScreen === btn.screen ? '#C80400' : 'rgba(0, 0, 0, 0.3)',
                            borderRadius: pulseDims.width * 0.1,
                            borderWidth: pulseDims.width * 0.003,
                            borderColor: 'white'
                        }}
                    >
                        <PulseNavImg
                            source={btn.icon}
                            style={{
                                width: pulseDims.width * 0.07,
                                height: pulseDims.width * 0.07,
                            }}
                            resizeMode="contain"
                        />
                    </PulseNavPress>
                ))}
            </PulseNavBox>
        </PulseNavBox>
    );
};

export default MidnightSalzburgNeonBeatsPagesConnection;