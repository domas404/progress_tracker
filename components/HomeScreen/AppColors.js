
const colors = {
    // main_color_light: '#AED3C5',
    main_color_light: '#c4bbf0',
    // main_color_dark: '#13573F',
    main_color_dark: '#4f438a',
    white: '#FFF',
    light_gray: '#EEE',
    gray: '#666',
    dark_gray: '#333',
    black: '#000',
    red: '#DE3F3F',
}

export default function appColors() {
    return({
        header_background: colors.main_color_dark,
        header_taskBackground: colors.main_color_dark,
        header_completeBar: colors.main_color_light,
        header_emptyBar: colors.main_color_dark,
        header_outline: colors.main_color_light,
        header_labelText: colors.main_color_light,
        header_labels: colors.main_color_light,
        header_text: colors.white,
        header_percentage: colors.main_color_dark,

        body_background: colors.light_gray,
        body_taskBackground: colors.white,
        body_completeBar: colors.main_color_dark,
        body_emptyBar: colors.main_color_light,
        body_labelText: colors.main_color_dark,
        body_labels: colors.main_color_light,
        body_text: colors.main_color_dark,
        body_percentage: colors.white,
        body_outline: colors.main_color_dark,

        button_background: colors.main_color_dark,
        button_text: colors.white,

        options_background: colors.white,
        options_option: colors.main_color_dark,
        options_deleteOption: colors.red,
        options_border: colors.light_gray,

        shadow: colors.gray,
        border: colors.main_color_light,

        icon: colors.main_color_light,
        icon_dark: colors.main_color_dark,

        otherText: colors.dark_gray,
    })
}