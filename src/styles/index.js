import { StyleSheet } from 'react-native';



export default StyleSheet.create({
    //Login
    centerContent: {
        backgroundColor: "#232323",
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
        color: "white"
    },
    textDark: {
        color: "#232323"
    },
    header: {
        // backgroundColor: "rgba(255,255,255,1)",
        backgroundColor: "#282828",
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
        alignItems: "center"
    },
    textBody: {
        color: "white",
        textAlign: "center",
        fontSize: 25
    },
    textTitle: {
        fontWeight: "bold", textAlign: "center", fontSize: 30, color: "white"
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
        backgroundColor: "#282828"
    },
    //Modal
    modal: {
        backgroundColor: "white",
        borderRadius: 10,
        padding: 22
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
        color: "#232323"
    },
    buttonPrimary: {
        backgroundColor: "#232323",
        borderColor: "#232323"
    },
    buttonSecondary: {
        backgroundColor: "white",
        borderColor: "#232323"
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
        backgroundColor: "#282828"
    },
    main: {
        backgroundColor: "#232323",
        // backgroundColor: "rgba(19,19,19,1)",
        flex: 1
    },

})
