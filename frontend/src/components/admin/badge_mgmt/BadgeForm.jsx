import React,{useState} from "react";

import AchievementRule from "./AchievementRule";
import BadgePreview from "./BadgePreview";

const BadgeForm=({
    initialData,
    onSubmit,
    submitting,
    submitLabel='create badge'
})=>{
    const [form,setForm]=useState({
        name:initialData?.name||'',
        slug:initialData?.slug||'',
        description:initialData?.description||'',
        icon:initialData?.icon||'workspace_premium',
        rarity:initialData?.rarity||'COMMON',
        xp_reward:initialData?.xp_reward||0,
        is_active:initialData?.is_active??true,
        rules:initialData?.rules?.map(rule=>({
            rule_type:rule.rule_type,
            target_value:rule.target_value,
        }))||[]
    })
    const handleChange=(e)=>{
        const {name,value}=e.target
        setForm(prev=>({
            ...prev,
            [name]:value,
        }))
    }
    const addRule=()=>{
        setForm(prev=>({
            ...prev,
            rules:[
                ...prev.rules,
                {
                    rule_type:'',
                    target_value:1,
                }
            ]
        }))
    }
    const updateRule=(index,field,value)=>{
        setForm(prev=>{
            const rules=[...prev.rules]
            rules[index]={
            ...rules[index],
            [field]:value
        }
        return {
            ...prev,
            rules,
        }
    })
    }
    const removeRule=(index)=>{
        setForm(prev=>({
            ...prev,
            rules:prev.rules.filter(
                (_,i)=>i!==index
            )
        }))
    }
    const handleSubmit=(e)=>{
        e.preventDefault()
        onSubmit({
            ...form,
            xp_reward:Number(form.xp_reward)
        })
    }
    return (
        <form onSubmit={handleSubmit}>

            {/* Basic information */}

            <div className="card border-0 shadow-sm mb-4">

                <div className="card-body p-4">

                    <h5 className="fw-bold mb-4">
                        Basic Information
                    </h5>

                    <div className="mb-3">

                        <label className="form-label">
                            Badge Name
                        </label>

                        <input
                            name="name"
                            className="form-control"
                            value={form.name}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <div className="mb-3">

                        <label className="form-label">
                            Slug
                        </label>

                        <input
                            name="slug"
                            className="form-control"
                            value={form.slug}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <div className="mb-3">

                        <div className="d-flex justify-content-between">

                            <label className="form-label">
                                Description
                            </label>

                            <small className="text-muted">
                                {form.description.length}/300
                            </small>

                        </div>

                        <textarea
                            name="description"
                            rows="4"
                            maxLength="300"
                            className="form-control"
                            value={form.description}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <div className="row g-3">

                        <div className="col-md-4">

                            <label className="form-label">
                                Icon
                            </label>

                            <input
                                name="icon"
                                className="form-control"
                                value={form.icon}
                                onChange={handleChange}
                            />

                        </div>

                        <div className="col-md-4">

                            <label className="form-label">
                                Rarity
                            </label>

                            <select
                                name="rarity"
                                className="form-select"
                                value={form.rarity}
                                onChange={handleChange}
                            >

                                <option value="COMMON">
                                    Common
                                </option>

                                <option value="RARE">
                                    Rare
                                </option>

                                <option value="EPIC">
                                    Epic
                                </option>

                                <option value="LEGENDARY">
                                    Legendary
                                </option>

                            </select>

                        </div>

                        <div className="col-md-4">

                            <label className="form-label">
                                XP Reward
                            </label>

                            <input
                                type="number"
                                min="0"
                                name="xp_reward"
                                className="form-control"
                                value={form.xp_reward}
                                onChange={handleChange}
                            />

                        </div>

                    </div>

                    <div className="form-check form-switch mt-4">

                        <input
                            type="checkbox"
                            className="form-check-input"
                            checked={form.is_active}
                            onChange={(e) =>
                                setForm(prev => ({
                                    ...prev,
                                    is_active:
                                        e.target.checked
                                }))
                            }
                        />

                        <label className="form-check-label">
                            Active Badge
                        </label>

                    </div>

                </div>

            </div>


            {/* Achievement rules */}

            <div className="card border-0 shadow-sm mb-4">

                <div className="card-body p-4">

                    <div className="d-flex justify-content-between align-items-center mb-4">

                        <div>

                            <h5 className="fw-bold mb-1">
                                Achievement Rules
                            </h5>

                            <small className="text-muted">
                                Define when users earn this badge.
                            </small>

                        </div>

                        <button
                            type="button"
                            className="btn btn-outline-primary"
                            onClick={addRule}
                        >
                            <i className="bi bi-plus-lg me-2"></i>
                            Add Rule
                        </button>

                    </div>

                    {form.rules.length === 0 ? (

                        <div className="text-center py-5 border rounded-3">

                            <i className="bi bi-sliders fs-1 text-muted"></i>

                            <p className="fw-semibold mt-3 mb-1">
                                No achievement rules
                            </p>

                            <p className="text-muted small">
                                Add at least one condition.
                            </p>

                        </div>

                    ) : (

                        form.rules.map(
                            (rule, index) => (

                                <AchievementRule
                                    key={index}
                                    rule={rule}
                                    index={index}
                                    onChange={updateRule}
                                    onRemove={removeRule}
                                />

                            )
                        )

                    )}

                </div>

            </div>


            {/* Preview */}

            <div className="card border-0 shadow-sm mb-4">

                <div className="card-body p-4">

                    <h5 className="fw-bold mb-4">
                        Badge Preview
                    </h5>

                    <BadgePreview
                        name={form.name}
                        description={form.description}
                        icon={form.icon}
                        rarity={form.rarity}
                    />

                </div>

            </div>


            <div className="d-flex justify-content-end gap-2">

                <button
                    type="submit"
                    className="btn btn-primary px-4"
                    disabled={submitting}
                >

                    {submitting ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Saving...
                        </>
                    ) : (
                        submitLabel
                    )}

                </button>

            </div>

        </form>
    )
}

export default BadgeForm