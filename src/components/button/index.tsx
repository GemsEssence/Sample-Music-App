import {
    Text,
    StyleSheet,
    Pressable,
} from 'react-native';

interface propsType {
    lable?: string;
    onPressButton?: () => void;
}

const Button: React.FC<propsType> = ({
    lable = '',
    onPressButton,
}) => {
    return (

        <Pressable
            onPress={onPressButton}
            style={styles.button}
        >
            <Text
                style={styles.title}
            >{lable}</Text>
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
