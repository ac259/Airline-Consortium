import numpy as np
from scipy.optimize import minimize
from scipy.io import loadmat
from numpy.linalg import det, inv
from math import sqrt, pi
import scipy.io
import matplotlib.pyplot as plt
import pickle
import sys
import os


def ldaLearn(X, y):
    # Inputs
    # X - a N x d matrix with each row corresponding to a training example
    # y - a N x 1 column vector indicating the labels for each training example
    #
    # Outputs
    # means - A d x k matrix containing learnt means for each of the k classes
    # covmat - A single d x d learnt covariance matrix

    # IMPLEMENT THIS METHOD
    means = []

    for i in range(1, 6):
        split_x = X[y.ravel() == i]
        means.append(np.mean(split_x, axis=0))

    covmat = np.cov(X.T)
    return np.array(means).T, covmat


def ldaTest(means, covmat, Xtest, ytest):
    acc = 0
    correct = 0
    ypred = []
    # Inputs
    # means, covmat - parameters of the LDA model
    # Xtest - a N x d matrix with each row corresponding to a test example
    # ytest - a N x 1 column vector indicating the labels for each test example
    # Outputs
    # acc - A scalar accuracy value
    # ypred - N x 1 column vector indicating the predicted labels
    inverse_covariance = np.linalg.inv(covmat)
    covariance_determinant = np.linalg.det(covmat)
    denominator = (np.pi * 2) * ((covariance_determinant)**0.5)
    for j in range(len(Xtest)):

        likelihood = []
        for i in range(len(means[0])):
            x_mu = Xtest[j] - means[:, i]
            likelihood.append(np.exp(-0.5 * (np.dot(np.dot(x_mu.T, inverse_covariance), x_mu)) / denominator))

        ypred.append(likelihood.index(max(likelihood)) + 1)
        if(ypred[j] == ytest[j]):
            correct += 1
    acc = correct / len(ytest)
    # IMPLEMENT THIS METHOD
    return acc, np.array(ypred)


def qdaLearn(X, y):
    # Inputs
    # X - a N x d matrix with each row corresponding to a training example
    # y - a N x 1 column vector indicating the labels for each training example
    #
    # Outputs
    # means - A d x k matrix containing learnt means for each of the k classes
    # covmats - A list of k d x d learnt covariance matrices for each of the k classes

    # IMPLEMENT THIS METHOD
        # IMPLEMENT THIS METHOD
    means = []
    covmats = []

    for i in range(1, 6):
        split_x = X[y.ravel() == i]
        means.append(np.mean(split_x, axis=0))
        covmats.append(np.cov(split_x.T))

    return np.array(means).T, covmats


def qdaTest(means, covmats, Xtest, ytest):
    acc = 0
    correct = 0
    ypred = []

    for j in range(len(Xtest)):
        likelihood = []
        for i in range(len(means[0])):
            inverse_covariance = np.linalg.inv(covmats[i])
            covariance_determinant = np.linalg.det(covmats[i])
            denominator = (np.pi * 2) * ((covariance_determinant)**0.5)
            x_mu = Xtest[j] - means[:, i]
            likelihood.append(np.exp(-0.5 * (np.dot(np.dot(x_mu.T, inverse_covariance), x_mu)) / denominator))
        ypred.append(likelihood.index(max(likelihood)) + 1)
        if(ypred[j] == ytest[j]):
            correct += 1
    acc = correct / len(ytest)
    return acc, np.array(ypred)


def learnRidgeRegression(X, y, lambd):
    # Inputs:
    # X = N x d
    # y = N x 1
    # lambd = ridge parameter (scalar)
    # Output:
    # w = d x 1

    # IMPLEMENT THIS METHOD
    N = X.shape[0]
    identity_matrix = np.identity(X.shape[1])
    w = np.dot(np.dot(np.linalg.inv(N * lambd * identity_matrix + np.dot(X.T, X)), X.T), y)

    return w


def learnOLERegression(X, y):
    # Inputs:
    # X = N x d
    # y = N x 1
    # Output:
    # w = d x 1
    squared = np.dot(np.transpose(X), X)
    sq_inv = np.linalg.inv(squared)
    x_t = np.transpose(X)
    w = np.dot(np.dot(sq_inv, x_t), y)

    # IMPLEMENT THIS METHOD
    return w


def regressionObjVal(w, X, y, lambd):

    # compute squared error (scalar) and gradient of squared error with respect
    # to w (vector) for the given data X and y and the regularization parameter
    # lambda
    # IMPLEMENT THIS METHOD
    third = np.dot(np.dot(w.T, w), lambd)
    first = np.dot(X, w)
    second = np.subtract(y, first)
    error = 0.5 * np.dot(second.T, first) + 0.5 * third

    err = np.dot(np.dot(X.T, X), w)
    err1 = np.dot(X.T, y)
    error_grad = np.subtract(err, err1)
    error_grad = np.add(error_grad, lambd * w)

    return error, error_grad


def testOLERegression(w, Xtest, ytest):
    # Inputs:
    # w = d x 1
    # Xtest = N x d
    # ytest = X x 1
    # Output:
    # mse

    # IMPLEMENT THIS METHOD
    sum_e = 0
    w_t = np.transpose(w)
    for i in range(len(Xtest)):
        wT_x = np.dot(w_t, Xtest[i])
        err = ytest[i] - wT_x
        err_sq = err * err
        sum_e += err_sq
    mse = sum_e / len(Xtest)

    return mse


def mapNonLinear(x, p):
    # Inputs:
    # x - a single column vector (N x 1)
    # p - integer (>= 0)
    # Outputs:
    # Xp - (N x (p+1))

    # IMPLEMENT THIS METHOD
    Xp = []
    for i in range(len(x)):
        Xp1 = [1]
        for i in range(1, p + 1):
            Xp1.append(Xp1[i - 1] * x[i])
        Xp.append(Xp1)
    return Xp


if sys.version_info.major == 2:
    X, y, Xtest, ytest = pickle.load(open('sample.pickle', 'rb'))
else:
    X, y, Xtest, ytest = pickle.load(open('sample.pickle', 'rb'), encoding='latin1')
# LDA
means, covmat = ldaLearn(X, y)
ldaacc, ldares = ldaTest(means, covmat, Xtest, ytest)
print('LDA Accuracy = ' + str(ldaacc))
# QDA
means, covmats = qdaLearn(X, y)
qdaacc, qdares = qdaTest(means, covmats, Xtest, ytest)
print('QDA Accuracy = ' + str(qdaacc))

# plotting boundaries
x1 = np.linspace(-5, 20, 100)
x2 = np.linspace(-5, 20, 100)
xx1, xx2 = np.meshgrid(x1, x2)
xx = np.zeros((x1.shape[0] * x2.shape[0], 2))
xx[:, 0] = xx1.ravel()
xx[:, 1] = xx2.ravel()

fig = plt.figure(figsize=[12, 6])
plt.subplot(1, 2, 1)

zacc, zldares = ldaTest(means, covmat, xx, np.zeros((xx.shape[0], 1)))
plt.contourf(x1, x2, zldares.reshape((x1.shape[0], x2.shape[0])), alpha=0.3)
plt.scatter(Xtest[:, 0], Xtest[:, 1], c=ytest.ravel())
plt.title('LDA')

plt.subplot(1, 2, 2)

zacc, zqdares = qdaTest(means, covmats, xx, np.zeros((xx.shape[0], 1)))
plt.contourf(x1, x2, zqdares.reshape((x1.shape[0], x2.shape[0])), alpha=0.3)
plt.scatter(Xtest[:, 0], Xtest[:, 1], c=ytest.ravel())
plt.title('QDA')

plt.show()
# Problem 2
if sys.version_info.major == 2:
    X, y, Xtest, ytest = pickle.load(open('diabetes.pickle', 'rb'))
else:
    X, y, Xtest, ytest = pickle.load(open('diabetes.pickle', 'rb'), encoding='latin1')

# add intercept
X_i = np.concatenate((np.ones((X.shape[0], 1)), X), axis=1)
Xtest_i = np.concatenate((np.ones((Xtest.shape[0], 1)), Xtest), axis=1)

w = learnOLERegression(X, y)
mle = testOLERegression(w, Xtest, ytest)

w_i = learnOLERegression(X_i, y)
mle_i = testOLERegression(w_i, Xtest_i, ytest)

print('MSE without intercept ' + str(sqrt(mle)))
print('MSE with intercept ' + str(sqrt(mle_i)))

# Problem 3
k = 101
lambdas = np.linspace(0, 1, num=k)
i = 0
mses3_train = np.zeros((k, 1))
mses3 = np.zeros((k, 1))
for lambd in lambdas:
    w_l = learnRidgeRegression(X_i, y, lambd)
print('w value is', w_l)

mses3_train[i] = testOLERegression(w_l, X_i, y)
mses3[i] = testOLERegression(w_l, Xtest_i, ytest)
i = i + 1
fig = plt.figure(figsize=[12, 6])
plt.subplot(1, 2, 1)
plt.plot(lambdas, mses3_train)
plt.title('MSE for Train Data')
plt.subplot(1, 2, 2)
plt.plot(lambdas, mses3)
plt.title('MSE for Test Data')
# plt.show()

# Problem 4
k = 101
lambdas = np.linspace(0, 1, num=k)
i = 0
mses4_train = np.zeros((k, 1))
mses4 = np.zeros((k, 1))
opts = {'maxiter': 20}    # Preferred value.
w_init = np.ones((X_i.shape[1], 1))
for lambd in lambdas:
    args = (X_i, y, lambd)
    w_l = minimize(regressionObjVal, w_init, jac=True, args=args, method='CG', options=opts)
    w_l = np.transpose(np.array(w_l.x))
    w_l = np.reshape(w_l, [len(w_l), 1])
    mses4_train[i] = testOLERegression(w_l, X_i, y)
    mses4[i] = testOLERegression(w_l, Xtest_i, ytest)
    i = i + 1
fig = plt.figure(figsize=[12, 6])
plt.subplot(1, 2, 1)
plt.plot(lambdas, mses4_train)
plt.plot(lambdas, mses3_train)
plt.title('MSE for Train Data')
plt.legend(['Using scipy.minimize', 'Direct minimization'])

plt.subplot(1, 2, 2)
plt.plot(lambdas, mses4)
plt.plot(lambdas, mses3)
plt.title('MSE for Test Data')
plt.legend(['Using scipy.minimize', 'Direct minimization'])
plt.show()


# Problem 5
pmax = 7
lambda_opt = 0  # REPLACE THIS WITH lambda_opt estimated from Problem 3
mses5_train = np.zeros((pmax, 2))
mses5 = np.zeros((pmax, 2))
for p in range(pmax):
    Xd = mapNonLinear(X[:, 2], p)
    Xdtest = mapNonLinear(Xtest[:, 2], p)
    w_d1 = learnRidgeRegression(Xd, y, 0)
    mses5_train[p, 0] = testOLERegression(w_d1, Xd, y)
    mses5[p, 0] = testOLERegression(w_d1, Xdtest, ytest)
    w_d2 = learnRidgeRegression(Xd, y, lambda_opt)
    mses5_train[p, 1] = testOLERegression(w_d2, Xd, y)
    mses5[p, 1] = testOLERegression(w_d2, Xdtest, ytest)

fig = plt.figure(figsize=[12, 6])
plt.subplot(1, 2, 1)
plt.plot(range(pmax), mses5_train)
plt.title('MSE for Train Data')
plt.legend(('No Regularization', 'Regularization'))
plt.subplot(1, 2, 2)
plt.plot(range(pmax), mses5)
plt.title('MSE for Test Data')
plt.legend(('No Regularization', 'Regularization'))
plt.show()