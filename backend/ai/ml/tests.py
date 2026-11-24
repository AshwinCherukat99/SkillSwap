import pandas as pd
from django.test import SimpleTestCase
from ai.ml.feature_engineering import (
    FEATURE_COLUMNS,
    build_feature_dataframe
)
from ai.ml.learner_segmenter import (
    SEGMENT_LABELS,
    LearnerSegmenter
)

class FeatureEngineeringTests(SimpleTestCase):
    def setUp(self):
        self.activity_records=[
            {
                "user_id": 1,
                "username": "learner_one",
                "sessions_attended": 2,
                "attendance_minutes": 90,
                "lessons_completed": 5,
                "assessments_completed": 2,
                "average_score": 75,
                "active_learning_days": 8,
            },
            {
                "user_id": 2,
                "username": "learner_two",
                "sessions_attended": 1,
                "attendance_minutes": 40,
                "lessons_completed": 3,
                "assessments_completed": 1,
                "average_score": 60,
                "active_learning_days": 4,
            },
        ]
    def test_build_feature_dataframe(self):
        dataframe=build_feature_dataframe(
            self.activity_records
        )
        self.assertIsInstance(
            dataframe,
            pd.DataFrame
        )
        self.assertEqual(
            len(dataframe),
            2
        )
        for column in FEATURE_COLUMNS:
            self.assertIn(
                column,
                dataframe.columns
            )
        self.assertIn(
            'user_id',
            dataframe.columns
        )
        self.assertIn(
            'username',
            dataframe.columns
        )
    def test_missing_features_are_filled_with_zeroes(self):
        records=[
            {
                'user_id':1,
                'username':'learner_one',
                'sessions_attended':2
            }
        ]
        dataframe=build_feature_dataframe(
            records
        )
        self.assertEqual(
            dataframe.loc[0,'attendance_minutes'],
            0
        )
        self.assertEqual(
            dataframe.loc[0,'lessons_completed'],
            0
        )
        self.assertEqual(
                    dataframe.loc[0,'assessments_completed'],
                    0
                )
        self.assertEqual(
                    dataframe.loc[0,'active_learning_days'],
                    0
                )
    def test_average_score_is_preserved(self):
        dataframe=build_feature_dataframe(
            self.activity_records
        )
        self.assertEqual(
            dataframe.loc[0,'average_score'],
            75
        )
        self.assertNotIn(
            'average_score',
            FEATURE_COLUMNS
        )
    def test_duplicate_user_ids_are_rejected(self):
        records=[
            {
                'user_id':1,
                'username':'learner_one',
                'sessions_attended':2
            },
            {
                'user_id':1,
                'username':'learner_one',
                'sessions_attended':3
            }
        ]
        with self.assertRaises(ValueError):
            build_feature_dataframe(records)
    def test_missing_user_id_is_rejected(self):
        records=[
            {
                'user_id':None,
                'username':'learner_one'
            }
        ]
        with self.assertRaises(ValueError):
            build_feature_dataframe(records)
    def test_negative_feature_values_are_rejected(self):
        records=[
            {
                'user_id':1,
                'username':'learner_one',
                'sessions_attended':-1
            }
        ]
        with self.assertRaises(ValueError):
            build_feature_dataframe(records)
    def test_empty_dataset_returns_empty_dataframe(self):
        dataframe=build_feature_dataframe([])
        self.assertIsInstance(dataframe,pd.DataFrame)
        self.assertTrue(dataframe.empty)
        self.assertIn('user_id',dataframe.columns)
        self.assertIn('average_score',dataframe.columns)

class LearnerSegmentationTests(SimpleTestCase):
    def setUp(self):
        self.activity_records=[
            # Low engagement learners
            {
                "user_id": 1,
                "username": "learner_one",
                "sessions_attended": 0,
                "attendance_minutes": 0,
                "lessons_completed": 0,
                "assessments_completed": 0,
                "average_score": None,
                "active_learning_days": 0,
            },
            {
                "user_id": 2,
                "username": "learner_two",
                "sessions_attended": 1,
                "attendance_minutes": 30,
                "lessons_completed": 1,
                "assessments_completed": 0,
                "average_score": 40,
                "active_learning_days": 2,
            },

            # Moderate engagement learners
            {
                "user_id": 3,
                "username": "learner_three",
                "sessions_attended": 3,
                "attendance_minutes": 120,
                "lessons_completed": 5,
                "assessments_completed": 2,
                "average_score": 65,
                "active_learning_days": 8,
            },
            {
                "user_id": 4,
                "username": "learner_four",
                "sessions_attended": 4,
                "attendance_minutes": 160,
                "lessons_completed": 7,
                "assessments_completed": 3,
                "average_score": 70,
                "active_learning_days": 10,
            },

            # High engagement learners
            {
                "user_id": 5,
                "username": "learner_five",
                "sessions_attended": 8,
                "attendance_minutes": 400,
                "lessons_completed": 15,
                "assessments_completed": 6,
                "average_score": 90,
                "active_learning_days": 22,
            },
            {
                "user_id": 6,
                "username": "learner_six",
                "sessions_attended": 10,
                "attendance_minutes": 500,
                "lessons_completed": 20,
                "assessments_completed": 8,
                "average_score": 95,
                "active_learning_days": 26,
            },
        ]
    def test_three_clusters_are_created(self):
        segmenter=LearnerSegmenter()
        result=segmenter.segment(
            self.activity_records
        )
        self.assertEqual(
            result['metrics']['n_clusters'],3
        )
        self.assertEqual(
            result['metrics']['n_learners'],6
        )
    def test_all_segment_labels_are_present(self):
        segmenter=LearnerSegmenter()
        result=segmenter.segment(
            self.activity_records
        )
        segments=set(
            result['learners']['segment']
        )
        self.assertEqual(
            segments,set(SEGMENT_LABELS)
        )
    def test_cluster_profiles_are_generated(self):
        segmenter=LearnerSegmenter()
        result=segmenter.segment(
            self.activity_records
        )
        profiles=result['cluster_profiles']
        self.assertEqual(len(profiles),3)
        self.assertIn("learner_count", profiles.columns)
        self.assertIn("sessions_attended", profiles.columns)
        self.assertIn("attendance_minutes", profiles.columns)
        self.assertIn("lessons_completed", profiles.columns)
        self.assertIn("assessments_completed", profiles.columns)
        self.assertIn("active_learning_days", profiles.columns)
        self.assertIn("average_score", profiles.columns)
    def test_silhoutte_score_is_valid(self):
        segmenter=LearnerSegmenter()
        result=segmenter.segment(
            self.activity_records
        )
        score=result['metrics']['silhoutte_score']
        self.assertIsNone(score)
        self.assertGreaterEqual(score,-1)
        self.assertLessEqual(score,1)
    def test_inertia_is_generated(self):
        segmenter=LearnerSegmenter()
        result=segmenter.segment(
            self.activity_records
        )
        self.assertIsNotNone(
            result['metrics']['inertia']
        )
        self.assertGreaterEqual(
            result['metrics']['inertia'],0
        )
    def test_average_score_does_not_effect_clustering_features(self):
        records=[
            record.copy()
            for record in self.activity_records
        ]
        segmenter=LearnerSegmenter()
        original_result=segmenter.segment(records)
        for record in records:
            record['average_score']=(
                100-record['average_score']
                if record['average_score'] is not None
                else None
            )
        modified_result=segmenter.segment(records)
        original_assignments=(
            original_result['learners']
            .set_index('user_id')['cluster_id']
            .sort_index()
        ) 
        modified_assigments=(
            modified_result['learners']
            .set_index('user_Id')['cluster_id']
            .sort_index()
        )
        pd.testing.assert_series_equal(
            original_assignments,
            modified_assigments,
        )
    def test_empty_dataset(self):
        segmenter=LearnerSegmenter()
        result=segmenter.segment([])
        self.assertEqual(
            result['metrics']['n_learners'],
            0
        )
        self.assertEqual(
            result['metrics']['n_clusters'],
            0
        )
        self.assertIsNone(
            result['metrics']['silhoutte_score']
        )
    def test_insufficient_learners_are_rejected(self):
        records=self.activity_records[:2]
        segmenter=LearnerSegmenter()
        with self.assertRaises(ValueError):
            segmenter.segment(records)
    def test_insufficient_distinct_profiles_are_rejected(self):
        records = [
            {
                "user_id": 1,
                "username": "learner_one",
                "sessions_attended": 2,
                "attendance_minutes": 60,
                "lessons_completed": 4,
                "assessments_completed": 1,
                "average_score": 70,
                "active_learning_days": 5,
            },
            {
                "user_id": 2,
                "username": "learner_two",
                "sessions_attended": 2,
                "attendance_minutes": 60,
                "lessons_completed": 4,
                "assessments_completed": 1,
                "average_score": 80,
                "active_learning_days": 5,
            },
            {
                "user_id": 3,
                "username": "learner_three",
                "sessions_attended": 2,
                "attendance_minutes": 60,
                "lessons_completed": 4,
                "assessments_completed": 1,
                "average_score": 90,
                "active_learning_days": 5,
            },
        ]
        segmenter=LearnerSegmenter()
        with self.assertRaises(ValueError):
            segmenter.segment(records)
    def test_invalid_cluster_count_is_rejected(self):
        with self.assertRaises(ValueError):
            LearnerSegmenter(n_clusters=2)