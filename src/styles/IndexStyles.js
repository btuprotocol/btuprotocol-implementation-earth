import * as Colors from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

export default class DispayPublicationStyle {

    customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)'
        }
    };

    styles2 = {
        headline: {
            fontSize: 24,
            paddingTop: 16,
            marginBottom: 12,
            fontWeight: 400,
        },
        slide: {
            padding: 10,
        },
    };

    appBar = getMuiTheme({
        palette: {
            primary1Color: Colors.indigo500,
            accent1Color: Colors.blueA100,
        },
        appBar: {
            height: 60,
        },
    });

    tabs = getMuiTheme({
        palette: {
            primary1Color: Colors.deepPurple200,
            textColor: Colors.darkBlack,
            accent1Color: Colors.black,
        }
    });
}
