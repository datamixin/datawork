#
# Copyright (c) 2020-2023 Datamixin.
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.#
import numpy as np
import pandas as pd
from sklearn.naive_bayes import GaussianNB
from sklearn.linear_model import LinearRegression
from sklearn.metrics import accuracy_score
from sklearn.metrics import confusion_matrix
from sklearn.metrics import mean_squared_error
from sklearn.metrics import mean_absolute_error
from sklearn.metrics import precision_recall_fscore_support


class Learning:

    MODEL = "model"
    FEATURES = "features"
    TARGET = "target"

    REGRESSION: str = "regression"
    CLASSIFICATION: str = "classification"

    def __init__(self) -> None:
        pass

    def fitTestResult(self, X_train, X_test, y_train, y_test):
        pass


class RegressionLearning(Learning):

    MAE = "mae"
    MSE = "mse"
    RMSE = "rmse"
    RESIDUALS = "residuals"
    PREDICTION = "prediction"
    ERROR = "error"
    STAGE = "stage"
    TRAIN = "train"
    TEST = "test"
    TRAIN_SCORE = "trainScore"
    TEST_SCORE = "testScore"

    def __init__(self) -> None:
        self._model: LinearRegression = None

    def fitTestResult(self, X_train: any, X_test: any, y_train: any, y_test: any):

        # Fit
        self._model.fit(X_train, y_train)
        return self.testResult(X_train, X_test, y_train, y_test)

    def testResult(self, X_train: any, X_test: any, y_train: any, y_test: any):

        # Predict
        y_train_pred = self._model.predict(X_train)
        y_test_pred = self._model.predict(X_test)

        # Scores
        trainScore = self._model.score(X_train, y_train)
        testScore = self._model.score(X_test, y_test)

        # Residuals
        e_train = y_train - y_train_pred
        e_test = y_test - y_test_pred
        stages = [RegressionLearning.TRAIN, RegressionLearning.TEST]
        predictions = [y_train_pred, y_test_pred]
        errors = [e_train, e_test]
        residuals = pd.DataFrame(
            {
                RegressionLearning.STAGE: stages,
                RegressionLearning.PREDICTION: predictions,
                RegressionLearning.ERROR: errors,
            }
        )
        explodes = [RegressionLearning.PREDICTION, RegressionLearning.ERROR]
        residuals = residuals.explode(explodes, ignore_index=True)

        return {
            Learning.MODEL: self._model,
            RegressionLearning.MAE: mean_absolute_error(y_test, y_test_pred),
            RegressionLearning.MSE: mean_squared_error(y_test, y_test_pred),
            RegressionLearning.RMSE: np.sqrt(mean_squared_error(y_test, y_test_pred)),
            RegressionLearning.TRAIN_SCORE: trainScore,
            RegressionLearning.TEST_SCORE: testScore,
            RegressionLearning.RESIDUALS: residuals,
        }


class ClassificationLearning(Learning):

    SUMMARY = "summary"
    CLASSES = "classes"
    ACCURACY_SCORE = "accuracyScore"
    CONFUSION_MATRIX = "confusionMatrix"

    def __init__(self) -> None:
        self._model: GaussianNB = None

    def fitTestResult(self, X_train: any, X_test: any, y_train: any, y_test: any):

        # Fit
        self._model.fit(X_train, y_train)
        return self.testResult(X_train, X_test, y_train, y_test)

    def testResult(self, X_train: any, X_test: any, y_train: any, y_test: any):

        # Predict
        y_test_pred = self._model.predict(X_test)

        labels = self._model.classes_
        summary = precision_recall_fscore_support(y_test, y_test_pred, labels=labels)

        return {
            Learning.MODEL: self._model,
            ClassificationLearning.SUMMARY: summary,
            ClassificationLearning.CLASSES: self._model.classes_,
            ClassificationLearning.ACCURACY_SCORE: accuracy_score(y_test, y_test_pred),
            ClassificationLearning.CONFUSION_MATRIX: confusion_matrix(y_test, y_test_pred),
        }
