// src/shared/lib/haptics.ts
import * as Haptics from 'expo-haptics';
import { Vibration } from 'react-native';

export const safeHaptics = {
    impactLight: () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {
            Vibration.vibrate(10);
        });
    },
    impactMedium: () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {
            Vibration.vibrate(15);
        });
    },
    selection: () => {
        Haptics.selectionAsync().catch(() => {
            Vibration.vibrate(8);
        });
    },
    notificationSuccess: () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {
            Vibration.vibrate([0, 15, 40, 15]);
        });
    },
};
