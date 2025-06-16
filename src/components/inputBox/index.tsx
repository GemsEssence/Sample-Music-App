import {
    View,
    Text,
    TextInput,
    StyleSheet,

} from 'react-native';

interface propsType {
    placeholder?: string;
    value?: string;
    onChangeText?: (val:string) => void;
    secureTextEntry?: boolean;
    lable?: string;
}

const InputBox: React.FC<propsType> = ({
    placeholder,
    value,
    onChangeText,
    secureTextEntry = false,
    lable = ''
}) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{lable}</Text>
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                secureTextEntry={secureTextEntry}
                value={value}
                onChangeText={onChangeText}
                placeholderTextColor={'#000'}
            />
        </View>
    );
};

export default InputBox;

const styles = StyleSheet.create({
    container: {
paddingVertical:10
       
    },
    title: {
        fontSize: 20,
        marginBottom: 10,
        textAlign: 'left',
        fontWeight: 'bold',
        color: '#333',
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        paddingHorizontal: 15,
        borderRadius: 8,
        backgroundColor: '#fff',
        color: '#000',
        fontSize:20
    },
    button: {
        backgroundColor: '#007bff',
        paddingVertical: 15,
        borderRadius: 8,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '600',
    },
});
