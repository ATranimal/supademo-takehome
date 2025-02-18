To run:

```
npm run dev
```


## Notes from the dev (Andrew Tran)

In the interest of time there are a few trade-offs I made:

- There are loading optimizations I could have done with the youtube IFrame player when switching videos to make it seamless to prevent blank loading states
  - In general, the youtube iframe player implementation is fairly clunky but as I was avoiding third party libraries and trying to stay within a reasonable timeframe I settled for a functional implementation
- No hover states or animations were implemented to make things more tactile
- I usually would abstract each useState declaration group into a custom hook for clarity
