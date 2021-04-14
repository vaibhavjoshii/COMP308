const tf = require("@tensorflow/tfjs");
const modelSaveLocation = "./app/models/predictionmodel.json";

exports.heartdiseasepredict = async (req, res) => {
  let data = req.body;

  const dataFeatures = tf.tensor2d(
    dataset.map((attr) => [
      attr.age > 50 ? 1 : 0,
      attr.cp > 0 ? 1 : 0,
      attr.sex,
      attr.trestbps,
      attr.chol,
      attr.thalach,
      attr.fbs,
      attr.exang,
    ])
  );
 
  const outputData = tf.tensor2d(dataset.map((attr) => [attr.target]));
  
  const model = tf.sequential();
  model.add(
    tf.layers.dense({
      inputShape: [8],
      activation: "sigmoid", 
      units: 10, 
    })
  );
  model.add(
    tf.layers.dense({
      inputShape: [10],
      activation: "sigmoid",
      units: 1,
    })
  );
  model.add(
    tf.layers.dense({
      activation: "sigmoid",
      units: 1,
    })
  );
  model.compile({
    loss: "binaryCrossentropy", 
    optimizer: "adam",
    metrics: ["accuracy"],
  });
  
  model
    .fit(dataFeatures, outputData, {
      epochs: 1000,
      callbacks: {
        onEpochEnd: (epoch, log) => {
          console.log(`Epoch ${epoch}: loss = ${log.loss}`);
        },
      },
    })

  const testData = [req.body];

  const testingData = tf.tensor2d(
    testData.map((attr) => [
      attr.age,
      attr.cp,
      attr.sex,
      attr.trestbps,
      attr.chol,
      attr.thalach,
      attr.fbs,
      attr.exang,
    ])
  );

  const results = model.predict(testingData);
  results.array().then((array) => {
    res.json(array[0][0]);
  });
};
