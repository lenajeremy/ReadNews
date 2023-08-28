import * as React from 'react';
import GBottomSheet, {
    BottomSheetBackdrop as GBottomSheetBackdrop,
    BottomSheetBackdropProps as GBottomSheetBackdropProps
} from '@gorhom/bottom-sheet';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../theme';


// Main BottomSheet Context
const BottomSheetContext = React.createContext<{
    updateSheetContent: (content: React.ReactNode) => void;
    bottomSheetRef: React.RefObject<GBottomSheet>;
    updateSnapPoints: (snapPoints: (string | number)[]) => void;
}>({
    updateSheetContent: () => { },
    bottomSheetRef: React.createRef(),
    updateSnapPoints: () => { },
});

// bottom sheet provider which is rendered in the App.tsx file
const BottomSheetProvider = ({ children }: { children: React.ReactNode }) => {

    const { colors } = useTheme<Theme>()
    const bottomSheetRef = React.useRef<GBottomSheet>(null);
    const [bottomSheetContent, setBottomSheetContent] = React.useState<React.ReactNode>(null)
    const [snapPoints, setSnapPoints] = React.useState<(string | number)[]>(['50%'])

    const renderBottomSheetBackdrop = React.useCallback(
        (props: GBottomSheetBackdropProps) => (
            <GBottomSheetBackdrop
                {...props}
                appearsOnIndex={0}
                disappearsOnIndex={-1}
                enableTouchThrough={false}
                opacity={0.7}
            />
        ),
        [],
    )

    return (
        <BottomSheetContext.Provider value={{
            updateSheetContent: setBottomSheetContent,
            bottomSheetRef,
            updateSnapPoints: setSnapPoints,
        }}>
            {children}
            <GBottomSheet
                ref={bottomSheetRef}
                snapPoints={snapPoints}
                index={-1}
                enablePanDownToClose={true}
                backgroundStyle={{ backgroundColor: colors.bottomSheetBackground }}
                backdropComponent={renderBottomSheetBackdrop}
                handleIndicatorStyle={{
                    backgroundColor: colors.mutedText,
                    height: 6,
                    width: 40,
                }}
            >
                { console.log('rendering new sheet content') as React.ReactNode }
                {bottomSheetContent}
            </GBottomSheet>
        </BottomSheetContext.Provider>
    )
}

// hook to handle the opening and closing of a bottom sheet
export const useBottomSheet = () => {
    const { updateSheetContent, updateSnapPoints, bottomSheetRef } = React.useContext(BottomSheetContext)

    function open(content: React.ReactNode, options?: { snapPoints: Array<number | string> }) {
        updateSheetContent(content)
        updateSnapPoints(options?.snapPoints || ['50%'])
        bottomSheetRef.current?.expand()
    }

    function close() {
        bottomSheetRef.current?.close()
    }

    return { openSheet: open, closeSheet: close, bottomSheetRef }
}

// bottomSheet component that is to be used in app.
export const BottomSheet = ({ children, snapPoints }: {
    children: React.ReactNode,
    snapPoints?: Array<string | number>
}) => {

    const { updateSheetContent, updateSnapPoints } = React.useContext(BottomSheetContext)

    React.useEffect(() => {
        updateSheetContent(children)
        updateSnapPoints(snapPoints || ['50%'])

        return () => {
            updateSheetContent(null)
            updateSnapPoints(['50%'])
        }
    }, [])

    return null
}

export default BottomSheetProvider