import React, {Component} from 'react'
import {Container, Drawer, List, ListItem} from 'native-base'
class DrawerContent extends Component 
{
    render()
    {
        const {open} = this.props;
        return(
            <Drawer ref={(ref) => {this.drawer = ref}} onClose={() => this.drawer._root.close()}>
            
            </Drawer>
        )
    }
}

export default DrawerContent;