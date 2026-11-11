import mongoose from 'mongoose';
export declare const Activity: mongoose.Model<{
    userId: mongoose.Types.ObjectId;
    action: string;
    details?: any;
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    userId: mongoose.Types.ObjectId;
    action: string;
    details?: any;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    userId: mongoose.Types.ObjectId;
    action: string;
    details?: any;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & mongoose.HydratedDocumentOverrides<{
    id: string;
}>, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    userId: mongoose.Types.ObjectId;
    action: string;
    details?: any;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    userId: mongoose.Types.ObjectId;
    action: string;
    details?: any;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, Omit<mongoose.DefaultSchemaOptions, "timestamps"> & {
    timestamps: true;
}> & Omit<{
    userId: mongoose.Types.ObjectId;
    action: string;
    details?: any;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & mongoose.HydratedDocumentOverrides<{
    id: string;
}>, unknown, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
    userId: mongoose.Types.ObjectId;
    action: string;
    details?: any;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
    userId: mongoose.Types.ObjectId;
    action: string;
    details?: any;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
} & Required<{
    _id: mongoose.Types.ObjectId;
}>>;
//# sourceMappingURL=Activity.d.ts.map