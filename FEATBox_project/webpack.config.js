module.exports = {
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader"
          }
        },

        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        },

        // {
        //   test: /\.css$/,
        //   use: ExtractTextPlugin.extract({
        //     fallback: 'style-loader',
        //     use: 'css-loader'
        //   })
        // },

        { test: /\.(png|jpg|ico)$/, loader: 'url-loader?limit=8192' }

        // {
        //   test: /\.(png|jpe?g|gif|ico)$/i,
        //   use: [
        //     {
        //       loader: 'file-loader',
        //     },
        //   ],
        // },

        
      //  
        
      ]
    }
  };