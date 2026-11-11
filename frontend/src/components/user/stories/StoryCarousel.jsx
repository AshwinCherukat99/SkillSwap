const StoryCarousel=({
    myStories,
    groups,
    onAddStory,
    onOpenStory
})=>{
    const getProfileImage=(story)=>
        story?.profile_image||'/default-avatar.png'
    return (
        <div className="stories-carousel-container">
            <div className="stories-carousel">

                {/* Current user's story */}
                <div
                    className="story-circle-item"
                    onClick={() => {
                        if (myStories.length > 0) {
                            onOpenStory(myStories[0]);
                        } else {
                            onAddStory();
                        }
                    }}
                >
                    <div className="story-avatar-ring story-own-ring">
                        <div className="story-avatar-inner">
                            <img
                                src={getProfileImage(myStories[0])}
                                alt="Your profile"
                                onError={(e) => {
                                    e.currentTarget.src = "/default-avatar.png";
                                }}
                            />
                        </div>

                        <button
                            className="story-add-icon"
                            onClick={(e) => {
                                e.stopPropagation();
                                onAddStory();
                            }}
                            aria-label="Add story"
                        >
                            +
                        </button>
                    </div>

                    <div className="story-circle-info">
                        <strong>Your Story</strong>
                        <small>
                            {myStories.length > 0
                                ? `${myStories.length} Active`
                                : "Add a story"}
                        </small>
                    </div>
                </div>

                <div className="story-carousel-divider" />

                {/* Other users' stories */}
                {groups.map((group) => {
                    const latestStory = group.stories[0];

                    return (
                        <div
                            key={group.userId}
                            className="story-circle-item"
                            onClick={() => onOpenStory(latestStory)}
                        >
                            <div className="story-avatar-ring">
                                <div className="story-avatar-inner">
                                    <img
                                        src={group.profileImage || "/default-avatar.png"}
                                        alt={group.fullName}
                                        onError={(e) => {
                                            e.currentTarget.src = "/default-avatar.png";
                                        }}
                                    />
                                </div>

                                {group.stories.length > 1 && (
                                    <span className="story-count-badge">
                                        {group.stories.length}
                                    </span>
                                )}
                            </div>

                            <div className="story-circle-info">
                                <strong>
                                    {group.fullName || group.username}
                                </strong>
                                <small>
                                    {group.stories.length}{" "}
                                    {group.stories.length === 1 ? "Story" : "Stories"}
                                </small>
                            </div>
                        </div>
                    );
                })}

                {groups.length === 0 && myStories.length === 0 && (
                    <p className="text-secondary small mb-0">
                        No active stories yet.
                    </p>
                )}

            </div>
        </div>
    )
}

export default StoryCarousel