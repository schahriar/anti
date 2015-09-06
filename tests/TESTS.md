# How to write tests for Anti
Writing tests for anti is easy. You create an HTML file with the expected input and the output in the same file and simply run:
```javascript
npm test
```
Your test will appear under **XSS Test Suite** with its name derived from the filename.

## Separating Input/Output
Input and output are separated with an HTML comment tag (<\!-- EXPECT -->)
```html
<div class="test">Hey</div>
<script id="willbeignored"></script>
<\!-- EXPECT -->
<div class="anti">
    <div class="test">Hey</div>
</div>
```
Make sure to wrap your output around a div with class="anti". Spaces and newlines are ignored in the process, although style attributes currently add an extra space at the end.

## Naming Your Tests
Capitalize all first letters and use an underscore **_** to indicate spaces between words. Try to avoid special characters.