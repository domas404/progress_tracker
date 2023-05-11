
const colors = {
    light_green: '#AED3C5',
    dark_green: '#13573F',
    white: '#FFF',
    light_gray: '#EEE',
    gray: '#666',
    dark_gray: '#333',
    black: '#000',
    red: '#DE3F3F',
}

export default function appColors() {
    return({
        header_background: colors.dark_green,
        header_taskBackground: colors.dark_green,
        header_completeBar: colors.light_green,
        header_emptyBar: colors.dark_green,
        header_outline: colors.light_green,
        header_labelText: colors.light_green,
        header_labels: colors.light_green,
        header_text: colors.white,
        header_percentage: colors.dark_green,

        body_background: colors.light_gray,
        body_taskBackground: colors.white,
        body_completeBar: colors.dark_green,
        body_emptyBar: colors.light_green,
        body_labelText: colors.dark_green,
        body_labels: colors.light_green,
        body_text: colors.dark_green,
        body_percentage: colors.white,
        body_outline: colors.dark_green,

        button_background: colors.dark_green,
        button_text: colors.white,

        options_background: colors.white,
        options_option: colors.dark_green,
        options_deleteOption: colors.red,
        options_border: colors.light_gray,

        shadow: colors.gray,
        border: colors.light_green,

        otherText: colors.dark_gray,
    })
}