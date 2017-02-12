import React from 'react';
import { connect } from 'react-redux';

import { activate } from '../actions/nav_tabs';

/**
 * creates a bootstrap-like navtab
 */
class NavTab extends React.Component {
  /**
   * @return {JSX}
   */
  render() {
    const { children, active } = this.props;

    const navClick = (event) => this.props.navClick(event, this.props.tab_key);

    return (
      <div className="react-nav-tabs">
        <ul className="nav nav-tabs" onClick={navClick} role="tablist">
          {React.Children.map(children, function(child) {
            const class_name = child.key == active ? 'active' : '';
            const label = child.props.tabLabel|| child.key;

            return (
              <li role="presentation" className={class_name}>
                <a data-toggle={child.key}>{label}</a>
              </li>
            );
          })}
        </ul>

        <div className="tab-content">
          {React.Children.map(children, function(child) {
            const class_names = ['tab-pane'];

            if (child.key == active) class_names.push('active');

            return <div className={class_names.join(' ')}>{child}</div>;
          })}
        </div>
      </div>
    );
  }
};

const mapStateToProps = (state, ownProps) => {
  return {
    active: state.get('nav_tabs').get(ownProps.tab_key),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    navClick: (event, tab_key) => {
      const key = event.target.attributes.getNamedItem('data-toggle').value;

      dispatch(activate(tab_key, key));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NavTab);
