import ClubDetailsModal from './ClubDetailsModal';
import MapView, { Marker, Callout } from 'react-native-maps';
import midnightClubs from '../MidnightSalzburgNeonBeatsData/midnightClubs';
import { fonts as neonFonts } from '../fonts';
import LinearGradient from 'react-native-linear-gradient';
import React, { useState as useNeonState, useRef as useNeonRef } from 'react';
import {
    SafeAreaView as NeonSafe,
    Text as NeonTxt,
    View as NeonView,
    Image as NeonImg,
    TouchableOpacity as NeonPress,
    Dimensions as NeonDims,
} from 'react-native';

const { width: glowScreenW, height: glowScreenH } = NeonDims.get('window');

const MidnightSalzburgNeonMap: React.FC = () => {
    const [searchClubName, setSearchClubName] = useNeonState('');
    const [openedClub, setOpenedClub] = useNeonState<any | null>(null);

    const filteredClubs = midnightClubs.filter(entry =>
        entry.mindightClub.toLowerCase().includes(searchClubName.toLowerCase())
    );

    const defaultRegion = midnightClubs.length > 0 ? {
        latitude: midnightClubs[0].mindightClubCoords.latitude,
        longitude: midnightClubs[0].mindightClubCoords.longitude,
        latitudeDelta: 0.01 * glowScreenH / 1000,
        longitudeDelta: 0.01 * glowScreenW / 1000,
    } : {
        latitude: 47.8095,
        longitude: 13.0550,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
    };

    const mapHandler = useNeonRef<MapView>(null);
    const markerNodes = useNeonRef<(Marker | null)[]>([]);

    const jumpToRandomClub = () => {
        const luckyIndex = Math.floor(Math.random() * filteredClubs.length);
        const luckyClub = filteredClubs[luckyIndex];
        mapHandler.current?.animateToRegion({
            latitude: luckyClub.mindightClubCoords.latitude,
            longitude: luckyClub.mindightClubCoords.longitude,
            latitudeDelta: 0.01 * glowScreenH / 1000,
            longitudeDelta: 0.01 * glowScreenW / 1000,
        });
        setTimeout(() => {
            markerNodes.current[luckyIndex]?.showCallout();
        }, 500);
    };

    return (
        <NeonView style={{ flex: 1 }}>
            <NeonView style={{
                zIndex: 10,
                top: glowScreenH * 0.04,
                right: glowScreenW * 0.05,
                left: glowScreenW * 0.05,
                position: 'absolute',
            }}>
                <NeonPress onPress={jumpToRandomClub} activeOpacity={0.85} style={{ width: '100%', marginTop: glowScreenH * 0.07 }}>
                    <LinearGradient
                        end={{ x: 1, y: 0 }}
                        start={{ x: 0, y: 0 }}
                        colors={['#C80400', '#870813']}
                        style={{
                            height: glowScreenH * 0.06,
                            alignItems: 'center',
                            borderRadius: glowScreenW * 0.1,
                            justifyContent: 'center',
                            width: '100%',
                        }}
                    >
                        <NeonTxt style={{
                            fontSize: glowScreenW * 0.05,
                            textAlign: 'center',
                            fontFamily: neonFonts.midnightMonratSemiBold,
                            color: '#fff',
                        }}>
                            Random Club
                        </NeonTxt>
                    </LinearGradient>
                </NeonPress>
            </NeonView>
            <NeonView style={{
                width: glowScreenW,
                height: glowScreenH,
            }}>
                <MapView
                    ref={mapHandler}
                    style={{
                        width: glowScreenW,
                        height: glowScreenH,
                    }}
                    initialRegion={defaultRegion}
                >
                    {filteredClubs.map((clubPoint, idx) => (
                        <Marker
                            key={idx}
                            ref={node => markerNodes.current[idx] = node}
                            coordinate={{
                                latitude: clubPoint.mindightClubCoords.latitude,
                                longitude: clubPoint.mindightClubCoords.longitude,
                            }}
                        >
                            <Callout tooltip onPress={() => setOpenedClub(clubPoint)}>
                                <NeonView style={{
                                    padding: glowScreenW * 0.03,
                                    overflow: 'hidden',
                                    backgroundColor: 'rgba(0,0,0,0.85)',
                                    alignItems: 'center',
                                    width: glowScreenW * 0.5,
                                    borderRadius: glowScreenW * 0.05,
                                    height: glowScreenW * 0.5,
                                    justifyContent: 'flex-end',
                                }}>
                                    <NeonImg
                                        source={clubPoint.midnightImageOfClub}
                                        style={{
                                            width: glowScreenW * 0.5,
                                            height: glowScreenW * 0.5,
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                        }}
                                        resizeMode="cover"
                                    />
                                    <NeonTxt style={{
                                        fontSize: glowScreenW * 0.045,
                                        color: '#fff',
                                        marginBottom: glowScreenH * 0.01,
                                        fontFamily: neonFonts.midnightMonratSemiBold,
                                    }}>
                                        {clubPoint.mindightClub}
                                    </NeonTxt>
                                    <NeonView
                                        style={{
                                            alignItems: 'center',
                                            borderRadius: glowScreenW * 0.1,
                                            paddingVertical: glowScreenH * 0.01,
                                            backgroundColor: '#870813',
                                            width: '100%',
                                            zIndex: 555,
                                        }}
                                    >
                                        <NeonTxt style={{
                                            fontSize: glowScreenW * 0.04,
                                            fontFamily: neonFonts.midnightMonratSemiBold,
                                            color: 'white',
                                        }}>
                                            View Club
                                        </NeonTxt>
                                    </NeonView>
                                </NeonView>
                            </Callout>
                        </Marker>
                    ))}
                    <NeonSafe />
                </MapView>
            </NeonView>
            <ClubDetailsModal
                visible={!!openedClub}
                club={openedClub}
                onClose={() => setOpenedClub(null)}
            />
        </NeonView>
    );
};

export default MidnightSalzburgNeonMap;