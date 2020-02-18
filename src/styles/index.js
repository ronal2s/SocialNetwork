import { StyleSheet } from 'react-native';

const PRIMARY_COLOR = "#232323";
const PRIMARY_COLOR_2 = "#282828";
const FONT_WEIGHT = "200";

export default StyleSheet.create({
    //Login
    centerContent: {
        backgroundColor: PRIMARY_COLOR,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginContent: {
        backgroundColor: "white",
        width: '90%',
        height: 450,
        borderRadius: 10,
        padding: 10
    },
    loginContentLogo: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginFormItems: {
        marginBottom: 10,
        marginTop: 10,
        backgroundColor: "white"
    },
    textWhite: {
        color: "white",
        fontWeight: FONT_WEIGHT
    },
    textDark: {
        color: PRIMARY_COLOR,
        fontWeight: FONT_WEIGHT
    },
    header: {
        // backgroundColor: "rgba(255,255,255,1)",
        backgroundColor: PRIMARY_COLOR_2,
        borderBottomWidth: 0,
        shadowOpacity: 0
    },
    headerTitle: {
        color: "white",
    },
    headerIcon: {
        color: "white",
    },
    dashboardCards: {
        backgroundColor: "white"
    },
    //Register page
    RegisterActiveDot: {
        backgroundColor: 'green'
    },
    RegisterInactiveDot: {
        backgroundColor: 'gray'
    },
    RegisterActiveStep: {
        backgroundColor: 'blue'
    },
    RegisterInactiveStep: {
        backgroundColor: 'gray'
    },
    RegisterActiveStepTitle: {
        fontWeight: 'bold'
    },
    RegisterInactiveStepTitle: {
        fontWeight: 'normal'
    },
    RegisterActiveStepNumber: {
        color: 'white'
    },
    RegisterInactiveStepNumber: {
        color: 'black'
    },
    RegisterViews: {
        backgroundColor: '#232323',
        flex: 1,
        justifyContent: "center",
        alignItems: "center",   
        paddingHorizontal: 10
    },
    textBody: {
        color: "white",
        textAlign: "center",
        fontSize: 20
    },
    textTitle: {
        // fontWeight: "bold", 
        textAlign: "center", 
        fontSize: 25, 
        color: "white", 
        fontWeight: FONT_WEIGHT
    },
    RegisterIconsSize: {
        width: 150, height: 150
    },
    RegisterItemsForm: {
        marginVertical: 10
    },
    RegisterFormContent: {
        margin: 10
    },
    RegisterItemsSpacing: {
        marginBottom: 10,
        marginTop: 10
    },
    buttonText: {
        color: "white"
    },
    //SideBar
    SidebarBkg: {
        backgroundColor: "#fafafa",
    },
    SidebarProfileLabel: {
        color: "white",
        fontSize: 20,
    },
    SidebarProfileView: {
        flex: 0.5,
        backgroundColor: "rgba(19,19,19,1)",
        justifyContent: "center",
        alignItems: "center"
    },
    SidebarProfileThumbnail: {
        width: 100,
        height: 100,
        borderRadius: 100 / 2,
        borderColor: "white",
        borderWidth: 2
    },
    sidebarItems: {
        backgroundColor: PRIMARY_COLOR_2
    },
    //Modal
    modal: {
        backgroundColor: "white",
        borderRadius: 10,
        padding: 22
    },
    modalDark: {
        backgroundColor: PRIMARY_COLOR,
        borderRadius: 10,
        padding: 0
    },
    modalViewBottom: {
        backgroundColor: "white",
        padding: 22,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 4,
        borderColor: "rgba(0, 0, 0, 0.1)",
    },
    modalTitles: {
        fontWeight: "bold",
        fontSize: 22,
        textAlign: "center",
        color: PRIMARY_COLOR
    },
    buttonPrimary: {
        backgroundColor: PRIMARY_COLOR,
        borderColor: PRIMARY_COLOR
    },
    buttonSecondary: {
        backgroundColor: "white",
        borderColor: PRIMARY_COLOR
    },
    //Profile Componente
    profileView: {
        justifyContent: "center",
        alignItems: "center"
    },

    //General
    textNormal: {
        color: "white"
    },
    icons: {
        color: "white"
    },
    PageSelected: {
        // color: "white"
        color: "white",
        // backgroundColor: "white"
    },
    PageNoSelected: {
        color: "gray",
        // backgroundColor: "white"////
    },
    ButtonSelected: {
        backgroundColor: "#ff867c"
    },
    divider: {
        backgroundColor: "#191919"
    },
    listItemSelected: {
        backgroundColor: "#191919",
        borderBottomWidth: 0
    },
    listTextSelected: {
        color: "#fafafa",
        fontWeight: "bold"
    },
    listTextUnselected: {
        color: "gray"
    },
    listItemUnselected: {
        borderBottomWidth: 0
    },
    DarkColorBackground: {
        backgroundColor: PRIMARY_COLOR_2
    },
    main: {
        backgroundColor: PRIMARY_COLOR,
        // backgroundColor: "rgba(19,19,19,1)",
        flex: 1
    },

    containerCentered: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: PRIMARY_COLOR
    }

})
