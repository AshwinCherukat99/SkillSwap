import pandas as pd

FEATURE_COLUMNS=[
    'sessions_attended',
    'attendance_minutes',
    'lessons_completed',
    'assessments_completed',
    'active_learning_days'
]

IDENTIFIER_COLUMNS=[
    'user_id',
    'username'
]    

def build_feature_dataframe(activity_records):
    if not activity_records:
        return pd.DataFrame(
            columns=IDENTIFIER_COLUMNS
            +FEATURE_COLUMNS
            +['average_score']
        )
    dataframe=pd.DataFrame(activity_records).copy()
    required_identifiers=[
        column for column in IDENTIFIER_COLUMNS
        if column not in dataframe.columns
    ]
    if required_identifiers:
        raise ValueError(
            f'missing identifier columns:{required_identifiers}'
        )
    if dataframe['user_id'].isnull().any():
        raise ValueError('user id cannot be empty')
    if dataframe['user_id'].duplicated().any():
        raise ValueError('duplicated learner records found')
    for column in FEATURE_COLUMNS:
        if column not in dataframe.columns:
            dataframe[column]=0
        dataframe[column]=pd.to_numeric(
            dataframe[column],
            errors='coerce'
        ).fillna(0)
        if (dataframe[column]<0).any():
            raise ValueError(
                f'{column} cannot contain negative values'
            )  
    if 'average_score' not in dataframe.columns:
        dataframe['average_score']=None
    dataframe['average_score']=pd.to_numeric(
        dataframe['average_score'],
        errors='coerce'
    )
    if dataframe['FEATURE_COLUMNS'].isnull().any().any():
        raise ValueError('invalid feature values detected')
    return dataframe