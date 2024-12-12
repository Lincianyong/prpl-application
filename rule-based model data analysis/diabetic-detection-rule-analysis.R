# Load necessary libraries
library(rpart)
library(rpart.plot)

# Getting the data
setwd("C:/Users/sasha/Documents/RDirectory")
data <- read.csv("diabetes_data_data.csv")

data

# Create a new dataframe starting with the original data
new_data <- data

# Convert integer columns to factors and add to the new dataframe
new_data$gender <- as.factor(data$gender)  # Add categorical version of Gender
new_data$polyuria <- as.factor(data$polyuria)  # Add categorical version of polyuria
new_data$polydipsia <- as.factor(data$polydipsia)  # Add categorical version of polydipsia
new_data$sudden_weight_loss <- as.factor(data$sudden_weight_loss)  # Add categorical version of sudden_weight_loss
new_data$weakness <- as.factor(data$weakness)  # Add categorical version of weakness
new_data$polyphagia <- as.factor(data$polyphagia)  # Add categorical version of polyphagia
new_data$genital_thrush <- as.factor(data$genital_thrush)  # Add categorical version of genital_thrush
new_data$visual_blurring <- as.factor(data$visual_blurring)  # Add categorical version of visual_blurring
new_data$itching <- as.factor(data$itching)  # Add categorical version of itching
new_data$class <- as.factor(data$class)  # Ensure target variable is also a factor

# Check the structure of the new dataframe
str(new_data)

# Handle missing values if necessary
new_data <- na.omit(new_data)

# Creating the CART model with all variables from the new dataframe
model <- rpart(class ~ ., 
               data = new_data, method = "class", control = rpart.control(minsplit = 2))

# Plot the tree
rpart.plot(model)

# Continue with model evaluation
set.seed(2014)
printcp(model)
optimal_cp <- model$cptable[which.min(model$cptable[,"xerror"]), "CP"]
model_cart_pruned <- prune(model, cp = optimal_cp)
rpart.plot(model_cart_pruned)

