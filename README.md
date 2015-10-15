# react-native-parallax

**NOTE: This module requires React Native 0.8+**

## Installation

```
npm install --save react-native-parallax
```

## Usage

*Note: `Parallax.Image` elements must be direct descendants of `Parallax.ScrollView`*

```js
var Parallax = require('react-native-parallax');

var ParallaxView = React.createClass({
  render: function() {
    return (
      <Parallax.ScrollView>
        <Parallax.Image
          style={{ height: 200 }}
          overlayStyle={{ backgroundColor: 'rgba(0,0,0,0.3)'}}
          source={{ uri: 'http://loremflickr.com/640/480' }}
        >
          <Text>This is optional overlay content</Text>
        </Parallax.Image>
      </Parallax.ScrollView>
    );
  },
});
```

## `Parallax.ScrollView` Properties

Any [`ScrollView` property](http://facebook.github.io/react-native/docs/scrollview.html) and the following:

| Prop | Description | Default |
|---|---|---|
|**`scrollViewComponent`**|What underlying component to compose around, must be `ScrollView` compatible. |`ScrollView`|

## `Parallax.Image` Properties

Any [`Image` property](http://facebook.github.io/react-native/docs/image.html) and the following:

| Prop | Description | Default |
|---|---|---|
|**`onPress`**|Fired when element is tapped.|*None*|
|**`imageStyle`**|Optional image style, `width` and `height` styles are set automatically.|*None*|
|**`overlayStyle`**|Optional overlay style, might be useful if you want a shaded background for better readability. |*None*|
|**`parallaxFactor`**|The speed of the parallax effect. Larger values require taller images or they will be zoomed in. |`0.2`|

## Demo

![Demo](https://cloud.githubusercontent.com/assets/378279/8894786/81b493f8-33c3-11e5-9a5a-8695642c6ee7.gif)

## Example 

Check full example in the `Example` folder. 

## License

[MIT License](http://opensource.org/licenses/mit-license.html). © Joel Arvidsson

