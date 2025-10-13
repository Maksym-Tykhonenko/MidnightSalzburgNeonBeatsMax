import { useNavigation as useNeonNav } from '@react-navigation/native';
import { fonts } from '../fonts';
import React, { memo, useState as useNeonState } from 'react';
import {
    View as NeonBox,
    Text as NeonTxt,
    Image as NeonImg,
    TouchableOpacity as NeonPress,
    useWindowDimensions,
    ScrollView,
} from 'react-native';

const neonSlides = [
    {
        key: 'glow1',
        img: require('../MidnightSalzburgNeonBeatsAssets/MidnightSalzburgNeonBeatsImages/MidnightPrepares/midnight1.png'),
        title: 'Follow the Lights',
        desc: 'Salzburg after midnight is a rhythm.\nDiscover the clubs glowing across the city — from loud dance floors to secret lounges',
    },
    {
        key: 'glow2',
        img: require('../MidnightSalzburgNeonBeatsAssets/MidnightSalzburgNeonBeatsImages/MidnightPrepares/midnight2.png'),
        title: 'Every Step Becomes a Story',
        desc: 'Mark the places you dance through. Add your own clubs, build your own routes',
    },
    {
        key: 'glow3',
        img: require('../MidnightSalzburgNeonBeatsAssets/MidnightSalzburgNeonBeatsImages/MidnightPrepares/midnight3.png'),
        title: 'Save the Moments That Glow',
        desc: 'Create folders of your neon nights. Upload photos, tag your favorite spots, and remember who you were under the lights',
    },
];

const DotsLine: React.FC<{ active: number; total: number }> = ({ active, total }) => (
    <NeonBox style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 14 }}>
        {Array.from({ length: total }).map((_, idx) => (
            <NeonBox
                key={`dot-${idx}`}
                style={{
                    backgroundColor: active === idx ? '#fff' : 'rgba(255,255,255,0.25)',
                    borderRadius: 7,
                    height: 12,
                    width: 12,
                    marginHorizontal: 5,
                }}
            />
        ))}
    </NeonBox>
);

const NeonSlide: React.FC<{
    img: any;
    title: string;
    desc: string;
    showClose?: boolean;
    onNext?: () => void;
    isLast: boolean;
    active: number;
    total: number;
    onSkip?: () => void;
    scrW: number;
    scrH: number;
}> = memo(({ img, title, desc, showClose, onNext, isLast, active, total, onSkip, scrW, scrH }) => {
    return (
        <NeonBox style={{ width: scrW, height: scrH }}>
            <NeonImg
                source={img}
                resizeMode="cover"
                style={{
                    borderBottomRightRadius: scrW * 0.065,
                    borderBottomLeftRadius: scrW * 0.065,
                    height: scrH * 0.64,
                    width: scrW,
                }}
            />
            {showClose && (
                <NeonPress
                    style={{
                        right: scrW * 0.055,
                        top: scrH * 0.045,
                        zIndex: 15,
                        position: 'absolute',
                    }}
                    onPress={onSkip}
                >
                    <NeonTxt style={{ fontSize: scrW * 0.072, color: '#fff' }}>×</NeonTxt>
                </NeonPress>
            )}
            <NeonBox
                style={{
                    paddingBottom: scrH * 0.05,
                    alignItems: 'center',
                    paddingTop: scrH * 0.01,
                    paddingHorizontal: scrW * 0.07,
                    width: scrW,
                }}
            >
                <NeonTxt
                    style={{
                        fontSize: scrW * 0.072,
                        fontWeight: 'bold',
                        color: '#fff',
                        textAlign: 'center',
                        marginBottom: scrH * 0.018,
                        fontFamily: fonts.midnightMonratSemiBold,
                    }}
                >
                    {title}
                </NeonTxt>
                <NeonTxt
                    style={{
                        lineHeight: scrH * 0.027,
                        color: '#fff',
                        textAlign: 'center',
                        fontFamily: fonts.midnightMonratMedium,
                        marginBottom: scrH * 0.035,
                        opacity: 0.82,
                        fontSize: scrW * 0.041,
                    }}
                >
                    {desc}
                </NeonTxt>
                {!isLast ? (
                    <DotsLine active={active} total={total} />
                ) : (
                    <NeonPress
                        style={{
                            alignItems: 'center',
                            borderRadius: scrW * 0.08,
                            width: scrW * 0.82,
                            paddingVertical: scrH * 0.02,
                            paddingHorizontal: scrW * 0.14,
                            backgroundColor: '#D50032',
                        }}
                        onPress={onNext}
                    >
                        <NeonTxt
                            style={{
                                letterSpacing: 0.5,
                                fontSize: scrW * 0.046,
                                color: '#fff',
                                fontWeight: 'bold',
                            }}
                        >
                            Start My Night
                        </NeonTxt>
                    </NeonPress>
                )}
            </NeonBox>
        </NeonBox>
    );
});

const MidnightSalzburgNeonBeatsOnboarding: React.FC = () => {
    const [screenIdx, setScreenIdx] = useNeonState(0);
    const { width: scrW, height: scrH } = useWindowDimensions();
    const nav = useNeonNav();

    const handleFinish = () => {
        nav.replace?.('MidnightSalzburgNeonBeatsPagesConnection');
    };

    const handleSkip = () => {
        nav.replace?.('MidnightSalzburgNeonBeatsPagesConnection');
    };

    const onScroll = (e: any) => {
        const idx = Math.round(e.nativeEvent.contentOffset.x / scrW);
        setScreenIdx(idx);
    };

    return (
        <NeonBox style={{ flex: 1, backgroundColor: '#1B0A0A' }}>
            <NeonImg
                source={require('../MidnightSalzburgNeonBeatsAssets/MidnightSalzburgNeonBeatsImages/midnightAppGround.png')}
                resizeMode="cover"
                style={{
                    left: 0,
                    height: scrH,
                    position: 'absolute',
                    zIndex: 1,
                    top: 0,
                    width: scrW,
                }}
            />
            <NeonBox style={{ flex: 1, zIndex: 2, width: scrW, height: scrH }}>
                <ScrollView
                    scrollEventThrottle={16}
                    pagingEnabled
                    contentContainerStyle={{ width: scrW * neonSlides.length, height: scrH }}
                    showsHorizontalScrollIndicator={false}
                    onScroll={onScroll}
                    horizontal
                >
                    {neonSlides.map((slide, idx) => (
                        <NeonSlide
                        scrW={scrW}
                        img={slide.img}
                            title={slide.title}
                            desc={slide.desc}
                            showClose={idx === 1}
                            onNext={handleFinish}
                            key={slide.key}
                                scrH={scrH}
                                active={screenIdx}
                            total={neonSlides.length}
                            onSkip={handleSkip}
                            isLast={idx === neonSlides.length - 1}
                        />
                    ))}
                </ScrollView>
            </NeonBox>
        </NeonBox>
    );
};

export default MidnightSalzburgNeonBeatsOnboarding;