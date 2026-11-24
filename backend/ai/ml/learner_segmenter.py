import numpy as np
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score
from sklearn.preprocessing import StandardScaler
from ai.ml.data_collector import collect_learner_activity

from ai.ml.feature_engineering import (
    FEATURE_COLUMNS,
    build_feature_dataframe
)

SEGMENT_LABELS=[
    'Low Engagement',
    'Moderate Engagement',
    'High Engagement'
]

class LearnerSegmenter:
    def __init__(
            self,
            n_clusters=3,
            random_state=42,
            n_init=10
    ):
        if n_clusters!=3:
            raise ValueError(
                'this learner segmentation implementation expects exactly 3 clusters'
            )
        self.n_clusters=n_clusters
        self.random_state=random_state
        self.n_init=n_init
        self.scaler=StandardScaler()
        self.model=KMeans(
            n_clusters=self.n_clusters,
            random_state=self.random_state,
            n_init=self.n_init
        )
    def segment(self,activity_records):
        dataframe=build_feature_dataframe(activity_records)
        if dataframe.empty:
            return {
                'learners':dataframe,
                'cluster_profiles':dataframe.copy(),
                'metrics':{
                    'n_learners':0,
                    'n_clusters':0,
                    'inertia':None,
                    'silhoutte_score':None,
                }
            }
        if len(dataframe)<self.n_clusters:
            raise ValueError(
                'at least 3 learners are required for learner segmentation'
            )  
        features=dataframe[FEATURE_COLUMNS].to_numpy(
            dtype=float
        )
        if not np.isfinite(features).all():
            raise ValueError(
                'feature matrix contains invalid numeric values'
            ) 
        unique_features=np.unique(features,axis=0)
        if len(unique_features)<self.n_clusters:
            raise ValueError(
                'At least 3 different learner activity profiles are required for clustering'
            )
        scaled_features=self.scaler.fit_transform(features)
        cluster_ids=self.model.fit_predit(scaled_features)
        dataframe['cluster_id']=cluster_ids
        centroid_scores=self.model.cluster_centers_.mean(
            axis=1
        )
        sorted_cluster_ids=np.argsort(
            centroid_scores
        )
        cluster_label_map={
            int(cluster_id):SEGMENT_LABELS[position]
            for position,cluster_id in enumerate(
                sorted_cluster_ids
            )
        }
        dataframe['segment']=dataframe['cluster_id'].map(cluster_label_map)  
        cluster_profiles=(
            dataframe.groupby('segment')
            .agg(
                learner_count=('user_id','count'),
                sessions_attended=('sessions_attended','mean'),
                attendance_minutes=('attendance_minutes','mean'),
                lessons_completed=('lessons_completed','mean'),
                assessments_completed=('assessments_completed','mean'),
                active_learning_days=('active_learning_days','mean'),
                average_score=('average_score','mean')
            )
            .reset_index()
        )
        unique_labels=np.unique(cluster_ids)
        score=None
        if 2<=len(unique_labels)<len(dataframe):
            score=float(
                silhouette_score(
                    scaled_features,
                    cluster_ids
                )
            ) 
        metrics={
            'n_learners':len(dataframe),
            'n_clusters':len(unique_labels),
            'inertia':float(self.model.inertia_),
            'silhoutte_score':score
        }
        return {
            'learners':dataframe,
            'cluster_profiles':cluster_profiles,
            'metrics':metrics
        } 
    def run_learner_segmentation(days=30):
        activity_records=collect_learner_activity(days=days)
        segmenter=LearnerSegmenter()
        return segmenter.segment(activity_records)