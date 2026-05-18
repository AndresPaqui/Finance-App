import { NativeModules, Platform } from 'react-native';

const { BubbleBridge } = NativeModules;

export const useBubble = () => {
    const toggleBubble = async (show: boolean) => {
        if (Platform.OS !== 'android') return;

        const tienePermiso = await BubbleBridge.checkOverlayPermission();
        if (!tienePermiso) {
            BubbleBridge.requestOverlayPermission();
            return;
        }

        if (show) {
            BubbleBridge.showBubble();
        } else {
            BubbleBridge.hideBubble();
        }
    };

    return { toggleBubble };
};