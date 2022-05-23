import React from 'react';
import { Image, Text, View, Animated, StyleSheet, Modal } from 'react-native';
import { Button } from 'react-native-paper';
import NfcManager from 'react-native-nfc-manager';
import { useTheme } from '@/Hooks';
import { setShowNfcPrompt } from '@/Store/Theme'
import { store } from '@/Store';


function NfcPromptAndroid() {
    const { Images, showNfcPrompt } = useTheme()
    const [visible, setVisible] = React.useState(false);
    const animValue = React.useRef(new Animated.Value(0)).current;
    const _visible = showNfcPrompt;
    const _setVisible = (payload: { showNfcPrompt: boolean | undefined }) => store.dispatch(setShowNfcPrompt(payload));

    React.useEffect(() => {
        _setVisible({ showNfcPrompt: false })
    }, [])

    React.useEffect(() => {
        if (_visible) {
            setVisible(true);
            Animated.timing(animValue, {
                duration: 300,
                toValue: 1,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(animValue, {
                duration: 200,
                toValue: 0,
                useNativeDriver: true,
            }).start(() => {
                setVisible(false);
            });
        }
    }, [_visible, animValue]);

    function cancelNfcScan() {
        NfcManager.cancelTechnologyRequest().catch(() => 0);
        _setVisible({ showNfcPrompt: false });
    }

    const bgAnimStyle = {
        backgroundColor: 'rgba(0,0,0,0.3)',
        opacity: animValue,
    };

    const promptAnimStyle = {
        transform: [
            {
                translateY: animValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [300, 0],
                }),
            },
        ],
    };

    return (
        <Modal transparent={true} visible={visible}>
            <View style={[styles.wrapper]}>
                <View style={{ flex: 1 }} />

                <Animated.View style={[styles.prompt, promptAnimStyle]}>
                    <View
                        style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Image
                            source={Images.nfcAndroid}
                            style={{ width: 120, height: 120, padding: 20 }}
                            resizeMode="contain"
                        />

                        <Text>Please bring your NFC tag closer</Text>
                    </View>

                    <Button mode="contained" onPress={cancelNfcScan}>
                        CANCEL
                    </Button>
                </Animated.View>

                <Animated.View style={[styles.promptBg, bgAnimStyle]} />
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        width: '100%',
        height: '100%',
        backgroundColor: 'transparent',
        alignItems: 'center',
    },
    promptBg: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
    },
    prompt: {
        height: 300,
        alignSelf: 'stretch',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        margin: 20,
        zIndex: 2,
    },
});

export default NfcPromptAndroid;
