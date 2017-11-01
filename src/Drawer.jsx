import '../style';
import React from 'react';
import RcDrawer from 'rc-drawer';
class Drawer extends React.Component{

  render() {
    return <RcDrawer {...this.props} />;
  }
}
Drawer.defaultProps = {
  prefixCls: 'am-drawer',
  enableDragHandle: false
};
Drawer.propTypes = {
    children:React.PropTypes.any,
    sidebarStyle:React.PropTypes.object,
    contentStyle:React.PropTypes.object,
    overlayStyle:React.PropTypes.object,
    dragHandleStyle:React.PropTypes.object,
    sidebar:React.PropTypes.any,
    open:React.PropTypes.bool,
    position:React.PropTypes.oneOf([ 'left','right','top','bottom']),
    docked:React.PropTypes.bool,
    transitions:React.PropTypes.bool,
    touch:React.PropTypes.bool,
    dragToggleDistance:React.PropTypes.number,
    /** below web only */
    prefixCls: React.PropTypes.string
};
Drawer.displayName = "Drawer";
module.exports=Drawer;
