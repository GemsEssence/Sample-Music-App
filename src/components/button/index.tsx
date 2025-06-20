import {
    Text,
    StyleSheet,
    Pressable,
} from 'react-native';

interface propsType {
    label?: string;
    onPressButton?: () => void;
}

const Button: React.FC<propsType> = ({
    label = '',
    onPressButton,
}) => {
    return (

        <Pressable
            onPress={onPressButton}
            style={styles.button}
        >
            <Text
                style={styles.title}
            >{label}</Text>
        </Pressable>

    );
};

export default Button;

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#000',
        padding: 10,
        marginVertical: 10,
        borderRadius:10
    },

    title: {
        fontSize: 15,
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#fff',
    },

});
