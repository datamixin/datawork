/*
 * Copyright (c) 2020-2023 Datamixin.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>. */
export default class CategoricalNaiveBayesPreload {

	public static GROUP = "CategoricalNaiveBayes";

	// array(['edible', 'poisonous'], dtype='<U9')
	public static ATTR_CLASSES = "classes_";

	// array([3391., 3108.])
	public static ATTR_CLASS_COUNT = "class_count_";

	// // [array([[ 327., 0.., 0.]]), array([[1248., 0.., 1121.]]), array([[989.,  36., .., 543.]])]			
	public static ATTR_CATEGORY_COUNT = "category_count_";

	// array([-0.660, -0.726])
	public static ATTR_CLASS_LOG_PRIOR = "class_log_prior_";

	// [array([[-2.327,...5484]]), array([[-0.989,...313]]), array([[-1.2237,...5716041]])]
	public static ATTR_FEATURE_LOG_PROB = "feature_log_prob_";

}
