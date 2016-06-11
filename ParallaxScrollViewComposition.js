/**
 * @providesModule ParallaxComposition
 */
'use strict';

var isArray = require('lodash/lang/isArray');
var React = require('react');
var {
  Animated,
  ScrollView
} = require('react-native');

var ParallaxImage = require('./ParallaxImage');

var applyPropsToParallaxImages = function(children, props) {
  if(isArray(children)) {
    return children.map(child => {
      if(isArray(child)) {
        return applyPropsToParallaxImages(child, props);
      }
      if(child.type === ParallaxImage) {
        return React.cloneElement(child, props);
      }
      return child;
    });
  }
  if(children.type === ParallaxImage) {
    return React.cloneElement(children, props);
  }
  return children;
};


var ParallaxScrollViewComposition = React.createClass({
  propTypes: {
    scrollViewComponent: React.PropTypes.func,
  },

  setNativeProps: function(nativeProps) {
    this._root.setNativeProps(nativeProps);
  },

  getScrollResponder: function() {
    return this._scrollComponent.getScrollResponder();
  },

  componentWillMount: function() {
    var scrollY = new Animated.Value(0);
    this.setState({ scrollY });
    this.onParallaxScroll = Animated.event(
      [{nativeEvent: {contentOffset: {y: scrollY}}}]
    );
  },

  render: function() {
    var { ref, children, scrollViewComponent, onScroll, ...props } = this.props;
    var { scrollY } = this.state;
    var ScrollComponent = scrollViewComponent || ScrollView;
    var handleScroll = (onScroll
      ? event => { this.onParallaxScroll(event); onScroll(event); }
      : this.onParallaxScroll
    );
    children = children && applyPropsToParallaxImages(children, { scrollY });
    return (
      <ScrollComponent
        ref={component => {
          this._root = component;
          if(typeof ref === 'function') {
            ref(component);
          }
        }}
        scrollEventThrottle={16}
        onScroll={handleScroll}
        {...props}
      >
        {children}
      </ScrollComponent>
    );
  }
});

module.exports = ParallaxScrollViewComposition;
